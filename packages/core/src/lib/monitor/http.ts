import { EventBus } from '../../utils/eventBus'
import {
  BEHAVIOR_TYPES,
  BehaviorEventData,
  ERROR_TYPES,
  ErrorEventData,
  EVENTTYPES,
} from '../../types/event'

interface RequestData {
  method: string
  url: string
  body?: any
  startTime: number
}

export class HttpMonitor {
  private xhrMap: WeakMap<XMLHttpRequest, RequestData> = new WeakMap()

  constructor(
    private eventBus: EventBus,
    private readonly ignoreUrls: (RegExp | string)[],
    private readonly reportUrl: string
  ) {
    this.reportUrl = reportUrl
  }

  init() {
    this.initXhr()
    this.initFetch()
  }

  private createHttpBehaviorEventData(data: Partial<BehaviorEventData>): BehaviorEventData {
    return {
      type: BEHAVIOR_TYPES.HTTP_REQUEST,
      timestamp: Date.now(),
      pageUrl: document.location.href,
      pageTitle: document.title,
      ...data,
    }
  }

  private createHttpErrorEventData(data: Partial<ErrorEventData>): ErrorEventData {
    return {
      type: ERROR_TYPES.HTTP_ERROR,
      timestamp: Date.now(),
      pageUrl: document.location.href,
      pageTitle: document.title,
      ...data,
    }
  }

  // 是否监控或者上报
  private isIgnoreUrls(url: string): boolean {
    //如果是上报请求
    if (url.includes(this.reportUrl)) return true
    return this.ignoreUrls.some(excludeUrl => {
      if (excludeUrl instanceof RegExp) {
        return excludeUrl.test(url)
      } else {
        return url.includes(excludeUrl)
      }
    })
  }

  initXhr() {
    const originalXHR = window.XMLHttpRequest.prototype
    const originalOpen = originalXHR.open
    const originalSend = originalXHR.send
    const xhrMap = this.xhrMap
    const eventBus = this.eventBus
    const createHttpBehaviorEventData = this.createHttpBehaviorEventData
    const createHttpErrorEventData = this.createHttpErrorEventData
    const isIgnoreUrls = this.isIgnoreUrls.bind(this)

    // 重写open
    originalXHR.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string,
      async?: boolean,
      user?: string | null,
      password?: string | null
    ) {
      const requestData = {
        method,
        url,
        startTime: Date.now(),
      }
      xhrMap.set(this, requestData)
      originalOpen.call(this, method, url, async ?? true, user ?? null, password ?? null)
    }

    //重写send
    originalXHR.send = function (
      this: XMLHttpRequest,
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      const requestData = xhrMap.get(this)
      if (requestData) {
        requestData.body = body

        // 检查是否忽略
        if (!isIgnoreUrls(requestData.url)) {
          // 监听加载完成
          this.addEventListener('loadend', function () {
            const endTime = Date.now()
            const duration = endTime - requestData.startTime
            const status = this.status
            const responseSize = this.response?.length || 0
            const requestSize = JSON.stringify(body || '')?.length || 0
            // 上报请求行为
            eventBus.emit(
              EVENTTYPES.BEHAVIOR,
              createHttpBehaviorEventData({
                method: requestData.method,
                url: requestData.url,
                duration,
                requestSize,
                status,
                responseSize,
              })
            )

            // 处理错误情况
            if (status >= 400 || status === 0) {
              eventBus.emit(
                EVENTTYPES.ERROR,
                createHttpErrorEventData({
                  method: requestData.method,
                  url: requestData.url,
                  response: this.response,
                  status,
                  message: `HTTP ${status} Error: ${this.statusText || 'Unknown Error'}`,
                })
              )
            }
          })

          // 监听网络错误
          this.addEventListener('error', function () {
            eventBus.emit(
              EVENTTYPES.ERROR,
              createHttpErrorEventData({
                method: requestData.method,
                url: requestData.url,
                status: 0,
                message: `Network Error`,
              })
            )
          })

          // 监听超时
          this.addEventListener('timeout', function () {
            eventBus.emit(
              EVENTTYPES.ERROR,
              createHttpErrorEventData({
                method: requestData.method,
                url: requestData.url,
                status: 0,
                message: `Request Timeout ${this.timeout}ms`,
              })
            )
          })
        }
      }

      originalSend.call(this, body)
    }
  }

  initFetch() {
    const originalFetch = window.fetch
    const eventBus = this.eventBus
    const createHttpBehaviorEventData = this.createHttpBehaviorEventData
    const createHttpErrorEventData = this.createHttpErrorEventData
    const isIgnoreUrls = this.isIgnoreUrls.bind(this)

    window.fetch = async function (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      const startTime = Date.now()
      const method = init?.method || 'GET'
      const url = input instanceof Request ? input.url : input.toString()
      const requestSize = JSON.stringify(init?.body || '')?.length || 0

      try {
        const response = await originalFetch(input, init)
        const endTime = Date.now()
        const duration = endTime - startTime
        const responseClone = response.clone()
        const responseText = await responseClone.text()
        const responseSize = responseText.length

        if (!isIgnoreUrls(url)) {
          // 上报请求行为
          eventBus.emit(
            EVENTTYPES.BEHAVIOR,
            createHttpBehaviorEventData({
              method,
              url,
              duration,
              requestSize,
              status: response.status,
              responseSize,
            })
          )

          // 处理错误情况
          if (!response.ok) {
            eventBus.emit(
              EVENTTYPES.ERROR,
              createHttpErrorEventData({
                method,
                url,
                response: responseText,
                status: response.status,
                message: `HTTP ${response.status} Error: ${response.statusText || 'Unknown Error'}`,
              })
            )
          }
        }

        return response
      } catch (error) {
        if (!isIgnoreUrls(url)) {
          // 处理网络错误
          eventBus.emit(
            EVENTTYPES.ERROR,
            createHttpErrorEventData({
              method,
              url,
              status: 0,
              message: error instanceof Error ? error.message : `Network Error`,
              stack: error instanceof Error ? error.stack : undefined,
            })
          )
        }
        throw error
      }
    }
  }
}
