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

  constructor(private eventBus: EventBus) {}
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

  initXhr() {
    const originalXHR = window.XMLHttpRequest.prototype
    const originalOpen = originalXHR.open
    const originalSend = originalXHR.send
    const xhrMap = this.xhrMap
    const eventBus = this.eventBus
    const createHttpBehaviorEventData = this.createHttpBehaviorEventData
    const createHttpErrorEventData = this.createHttpErrorEventData

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

        // 监听加载完成
        this.addEventListener('loadend', function () {
          const endTime = Date.now()
          const duration = endTime - requestData.startTime
          const status = this.status
          const responseSize = this.response?.length || 0
          const requestSize = JSON.stringify(body || '')?.length || 0
          console.log('¬∆¬ loadend duration', duration)
          console.log('¬∆¬ loadend responseSize', responseSize)
          console.log('¬∆¬ loadend requestStatus', status)
          console.log('¬∆¬ loadend requestSize', requestSize)
          console.log('¬∆¬ loadend this', this)
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
              })
            )
          }
        })
      }
      originalSend.call(this, body)
    }
  }
  initFetch() {}
}
