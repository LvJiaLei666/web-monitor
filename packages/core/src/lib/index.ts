import { InitOptions } from '../types/options'
import { EventBus } from '../utils/eventBus'
import { ErrorMonitor } from './monitor/error'
import { BehaviorMonitor } from './monitor/behavior'
import { Reporter } from './reporter/reporter'
import {
  BehaviorEventData,
  ErrorEventData,
  EVENTTYPES,
  MonitorEventData,
  PerformanceEventData,
} from '../types/event'
import { HttpMonitor } from './monitor/http'
import { PerformanceMonitor } from './monitor/performance'

export class Monitor {
  // 参数
  private readonly options: InitOptions
  // private plugins = new Map()
  private errorMonitor: ErrorMonitor
  private performanceMonitor: PerformanceMonitor
  private behaviorMonitor: BehaviorMonitor
  private httpMonitor: HttpMonitor
  private reporter: Reporter

  eventBus: EventBus = new EventBus()
  constructor(options: InitOptions) {
    this.options = options
    this.errorMonitor = new ErrorMonitor(this.eventBus)
    this.behaviorMonitor = new BehaviorMonitor(this.eventBus)
    this.httpMonitor = new HttpMonitor(this.eventBus)
    this.performanceMonitor = new PerformanceMonitor(this.eventBus)
    this.reporter = new Reporter(this.options)
  }

  init() {
    this.initError()
    this.initBehavior()
    this.initPerformance()
    this.initReport()
    this.initHttp()
  }

  private initError() {
    if (this.options.enableError) {
      this.errorMonitor.init()
    }
  }

  private initPerformance() {
    if (this.options.enablePerformance) {
      this.performanceMonitor.init()
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

    this.eventBus.on(EVENTTYPES.BEHAVIOR, (data: BehaviorEventData) =>
      handleReport(EVENTTYPES.BEHAVIOR, data)
    )

    this.eventBus.on(EVENTTYPES.PERFORMANCE, (data: PerformanceEventData) =>
      handleReport(EVENTTYPES.PERFORMANCE, data)
    )
  }

  private initHttp() {
    if (this.options.enableError || this.options.enableBehavior) {
      this.httpMonitor.init()
    }
  }
}
