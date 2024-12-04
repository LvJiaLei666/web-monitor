import { EventBus } from '../../utils/eventBus'
import { ERROR_TYPES, ErrorEventData, EVENTTYPES } from '../../types/event'
import { getElementPath } from '../../utils'

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

  private emitErrorEvent(data: Partial<ErrorEventData>): void {
    this.eventBus.emit(EVENTTYPES.ERROR, data)
  }

  // 监听js报错
  private initJsError() {
    window.addEventListener(
      'error',
      event => {
        if (event instanceof ErrorEvent) {
          const data = this.createErrorEvent(ERROR_TYPES.JS_ERROR, {
            message: event.message,
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          })

          this.emitErrorEvent(data)
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
        const data = this.createErrorEvent(ERROR_TYPES.PROMISE_ERROR, {
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
        })

        this.emitErrorEvent(data)
      },
      true
    )
  }

  // 监听资源错误
  private initResourceError() {
    window.addEventListener(
      'error',
      event => {
        // 判断事件的目标是否是资源（图片、脚本、CSS等）
        const target = event.target as HTMLElement
        const isResourceError = [
          event.target instanceof HTMLImageElement,
          event.target instanceof HTMLScriptElement,
          event.target instanceof HTMLLinkElement,
        ].some(Boolean)

        if (!isResourceError) return

        const data = this.createErrorEvent(ERROR_TYPES.RESOURCE_ERROR, {
          tagName: target?.tagName,
          url:
            (target as HTMLImageElement | HTMLScriptElement)?.src ||
            (target as HTMLLinkElement)?.href,
          path: getElementPath(target),
        })

        this.emitErrorEvent(data)
      },
      true
    )
  }

  // 监听请求错误
  reportHttpError(data: Partial<ErrorEventData>) {
    const error = this.createErrorEvent(ERROR_TYPES.HTTP_ERROR, data)
    this.emitErrorEvent(error)
  }
}
