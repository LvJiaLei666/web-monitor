import { EventBus } from '../../utils/eventBus'
import { BEHAVIOR_TYPES, BehaviorEventData, EVENTTYPES } from '../../types/event'

export class BehaviorMonitor {
  constructor(private eventBus: EventBus) {}

  init() {
    this.initClick()
    this.initPopstate()
    this.initHashchange()
    this.initLoad()
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
    this.eventBus.emit(EVENTTYPES.BEHAVIOR, this.createBehaviorEvent(BEHAVIOR_TYPES.CLICK, data))
  }

  // 获取元素路径
  private getElementPath(element: HTMLElement): string {
    const path: string[] = []
    let current: HTMLElement | null = element

    while (current) {
      const tag = current.tagName.toLowerCase()
      const id = current.id ? `#${current.id}` : ''
      const classes = Array.from(current.classList)
        .map(c => `.${c}`)
        .join('')
      path.unshift(`${tag}${id}${classes}`)
      current = current.parentElement
    }

    return path.join(' > ')
  }

  private initClick() {
    window.addEventListener('click', event => {
      const target = event.target as HTMLElement
      if (!target) return
      const data = this.createBehaviorEvent(BEHAVIOR_TYPES.CLICK, {
        path: this.getElementPath(target),
        clientX: event.clientX,
        clientY: event.clientY,
        tagName: target.tagName,
      })
      this.emitBehaviorEvent(data)
    })
  }

  private initPopstate() {}

  private initHashchange() {}

  private initLoad() {}

  private initBeforeunload() {}

  private initNetworkStatus() {
    window.addEventListener('online', event => {
      this.emitBehaviorEvent(this.createBehaviorEvent(BEHAVIOR_TYPES.ONLINE, {}))
    })
    window.addEventListener('offline', event => {
      this.emitBehaviorEvent(this.createBehaviorEvent(BEHAVIOR_TYPES.OFFLINE, {}))
    })
  }
}
