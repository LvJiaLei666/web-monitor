import { InitOptions } from '../types/options'
import { EventBus } from '../utils/eventBus'
import { ErrorMonitor } from './monitor/error'
import { BehaviorMonitor } from './monitor/behavior'
import { Reporter } from './reporter/reporter'
import { ErrorEventData, EVENTTYPES, MonitorEventData } from '../types/event'

export class Monitor {
  // 参数
  private options: InitOptions
  // private plugins = new Map()
  private errorMonitor: ErrorMonitor
  // private performanceMonitor
  private behaviorMonitor: BehaviorMonitor
  private reporter: Reporter

  eventBus: EventBus = new EventBus()
  constructor(options: InitOptions) {
    this.options = options
    this.errorMonitor = new ErrorMonitor(this.eventBus)
    this.behaviorMonitor = new BehaviorMonitor(this.eventBus)
    this.reporter = new Reporter(this.options.reportUrl)
  }

  init() {
    this.initError()
    this.initBehavior()
    this.initPerformance()
    this.initReport()
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
      this.behaviorMonitor.init()
    }
  }
  private initReport() {
    const handleReport = (type: EVENTTYPES, data: MonitorEventData) => {
      this.reporter.send(data)
    }

    this.eventBus.on(EVENTTYPES.ERROR, (data: ErrorEventData) =>
      handleReport(EVENTTYPES.ERROR, data)
    )

    this.eventBus.on(EVENTTYPES.BEHAVIOR, (data: MonitorEventData) =>
      handleReport(EVENTTYPES.BEHAVIOR, data)
    )
  }
}
