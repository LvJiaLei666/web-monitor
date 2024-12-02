import { EventBus } from '../lib/eventBus'
import { BEHAVIOR_TYPES, BehaviorEventData, EVENTTYPES } from '../types/event'

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

  private initClick() {}

  private initPopstate() {}

  private initHashchange() {}

  private initLoad() {}

  private initBeforeunload() {}

  private initNetworkStatus() {
    window.addEventListener('online', event => {
      this.eventBus.emit(EVENTTYPES.BEHAVIOR, this.createBehaviorEvent(BEHAVIOR_TYPES.ONLINE, {}))
    })
    window.addEventListener('offline', () => {
      this.eventBus.emit(EVENTTYPES.OFFLINE)
    })
  }
}
