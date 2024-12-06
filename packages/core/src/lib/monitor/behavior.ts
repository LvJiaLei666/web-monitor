import { EventBus } from '@web-monitor/core/src/utils/eventBus.ts'
import { BEHAVIOR_TYPES, BehaviorEventData, EVENTTYPES } from '../../types/event'
import { getElementPath } from '../../utils'

export class BehaviorMonitor {
  constructor(private eventBus: EventBus) {}

  // 累计时长
  private duration = 0
  // 开始时间
  private startTime = 0

  init() {
    this.initTime()
    this.initClick()
    this.initPopstate()
    this.initHashchange()
    this.initBeforeunload()
    this.initNetworkStatus()
  }

  private createBehaviorEvent(
    type: BEHAVIOR_TYPES,
    data: Partial<BehaviorEventData>
  ): BehaviorEventData {
    return {
      type,
      timestamp: Date.now(),
      pageUrl: document.location.href,
      pageTitle: document.title,
      ...data,
    }
  }

  private emitBehaviorEvent(data: Partial<BehaviorEventData>) {
    this.eventBus.emit(EVENTTYPES.BEHAVIOR, data)
  }

  private initClick() {
    window.addEventListener('click', event => {
      const target = event.target as HTMLElement
      if (!target) return
      const data = this.createBehaviorEvent(BEHAVIOR_TYPES.CLICK, {
        path: getElementPath(target),
        clientX: event.clientX,
        clientY: event.clientY,
        tagName: target.tagName,
      })
      this.emitBehaviorEvent(data)
    })
  }

  private initPopstate() {
    window.addEventListener('popstate', () => {
      const data = this.createBehaviorEvent(BEHAVIOR_TYPES.POPSTATE, {
        from: document.referrer,
        to: document.location.href,
      })
      this.emitBehaviorEvent(data)
    })
  }

  private initHashchange() {
    window.addEventListener('hashchange', event => {
      const data = this.createBehaviorEvent(BEHAVIOR_TYPES.HASHCHANGE, {
        from: event.oldURL,
        to: event.newURL,
      })
      this.emitBehaviorEvent(data)
    })
  }

  private initTime() {
    window.addEventListener('load', () => {
      this.startTime = Date.now()
    })

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.duration += Date.now() - this.startTime
      } else {
        this.startTime = Date.now()
      }
    })
  }

  private initBeforeunload() {
    window.addEventListener('beforeunload', () => {
      const stayDuration = (Date.now() + this.duration - this.startTime) / 1000
      const data = this.createBehaviorEvent(BEHAVIOR_TYPES.BEFOREUNLOAD, { stayDuration })
      this.emitBehaviorEvent(data)
    })
  }

  private initNetworkStatus() {
    window.addEventListener('online', () => {
      this.emitBehaviorEvent(this.createBehaviorEvent(BEHAVIOR_TYPES.ONLINE, {}))
    })
    window.addEventListener('offline', () => {
      this.emitBehaviorEvent(this.createBehaviorEvent(BEHAVIOR_TYPES.OFFLINE, {}))
    })
  }

  public reportHttpRequest() {
    this.emitBehaviorEvent(this.createBehaviorEvent(BEHAVIOR_TYPES.HTTP_REQUEST, {}))
  }
}
