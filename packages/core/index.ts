import { InitOptions } from './src/types/options'
import { EventBus } from './src/lib/eventBus'
import { ErrorMonitor } from './src/monitor/error'

export class Monitor {
  // 参数
  private options: InitOptions
  private plugins
  private errorMonitor: ErrorMonitor
  private performanceMonitor
  private behaviorMonitor
  private reporter

  eventBus: EventBus = new EventBus()
  constructor(options: InitOptions) {
    this.options = options
    this.errorMonitor = new ErrorMonitor(this.eventBus)
  }

  init() {
    this.initError()
    this.initBehavior()
    this.initPerformance()
  }

  private initError() {
    if (this.options.enableError) {
      this.errorMonitor.init()
    }
  }

  private initPerformance() {
    if (this.options.enablePerformance) {
    }
  }

  private initBehavior() {
    if (this.options.enableBehavior) {
    }
  }
}
