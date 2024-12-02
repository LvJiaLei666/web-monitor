import { EventBus } from '../lib/eventBus'
import { ERROR_TYPES, ErrorEventData, EVENTTYPES } from '../types/event'

export class ErrorMonitor {
  constructor(private eventBus: EventBus) {}

  init() {
    this.initJsError()
    this.initPromiseError()
    this.initResourceError()
  }

  // 创建错误数据集
  private createErrorEvent(type: ERROR_TYPES, data: Partial<ErrorEventData>): ErrorEventData {
    return {
      type,
      timestamp: Date.now(),
      pageUrl: document.location.href,
      pageTitle: document.title,
      ...data,
    }
  }

  // 监听js报错
  private initJsError() {
    window.addEventListener(
      'error',
      event => {
        if (event instanceof ErrorEvent) {
          this.eventBus.emit(
            EVENTTYPES.ERROR,
            this.createErrorEvent(ERROR_TYPES.JS_ERROR, {
              message: event.message,
              stack: event.error?.stack,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
            })
          )
        }
      },
      true
    )
  }

  // 监听Promise错误
  private initPromiseError() {
    window.addEventListener(
      'unhandledrejection',
      event => {
        this.eventBus.emit(
          EVENTTYPES.ERROR,
          this.createErrorEvent(ERROR_TYPES.PROMISE_ERROR, {
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack,
          })
        )
      },
      true
    )
  }

  // 监听资源错误
  private initResourceError() {
    window.addEventListener(
      'error',
      event => {
        const target = event.target as HTMLElement
        this.eventBus.emit(
          EVENTTYPES.ERROR,
          this.createErrorEvent(ERROR_TYPES.RESOURCE_ERROR, {
            tagName: target?.tagName,
            url:
              (target as HTMLImageElement | HTMLScriptElement)?.src ||
              (target as HTMLLinkElement)?.href,
          })
        )
      },
      true
    )
  }

  // 监听请求错误
  reportHttpError(data: Partial<ErrorEventData>) {
    this.eventBus.emit(EVENTTYPES.ERROR, this.createErrorEvent(ERROR_TYPES.HTTP_ERROR, data))
  }
}
