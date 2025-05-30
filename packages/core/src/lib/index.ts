import { checkOptions, defaultOptions, InitOptions } from '../types/options'
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

// 插件接口定义
export interface Plugin {
  name: string
  init?(monitor: Monitor): void
  onEvent?(eventType: EVENTTYPES, data: MonitorEventData): void
  beforeSend?(data: MonitorEventData): MonitorEventData | false
  afterSend?(data: MonitorEventData): void
  destroy?(): void
}

export class Monitor {
  // 参数
  private readonly options: InitOptions
  private plugins = new Map<string, Plugin>()
  private errorMonitor: ErrorMonitor
  private performanceMonitor: PerformanceMonitor
  private behaviorMonitor: BehaviorMonitor
  private httpMonitor: HttpMonitor
  private reporter: Reporter

  eventBus: EventBus = new EventBus()
  constructor(options: InitOptions) {
    this.options = { ...defaultOptions, ...options }
    checkOptions(this.options)

    this.errorMonitor = new ErrorMonitor(this.eventBus)
    this.behaviorMonitor = new BehaviorMonitor(this.eventBus)
    this.httpMonitor = new HttpMonitor(
      this.eventBus,
      this.options.ignoreUrls || [],
      this.options.reportUrl
    )
    this.performanceMonitor = new PerformanceMonitor(this.eventBus)
    this.reporter = new Reporter(this.options)
  }

  // 使用插件
  use(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} has already been registered`)
      return
    }
    this.plugins.set(plugin.name, plugin)
    plugin.init?.(this)
  }

  // 移除插件
  unuse(pluginName: string) {
    const plugin = this.plugins.get(pluginName)
    if (plugin) {
      plugin.destroy?.()
      this.plugins.delete(pluginName)
    }
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
      // 触发插件的事件处理
      this.plugins.forEach(plugin => {
        plugin.onEvent?.(type, data)
      })

      // 数据发送前处理
      let processedData = data
      for (const plugin of this.plugins.values()) {
        const result = plugin.beforeSend?.(processedData)
        if (result === false) {
          return // 如果插件返回 false，则不上报数据
        }
        if (result) {
          processedData = result
        }
      }

      // 发送数据
      this.reporter.send(type, processedData)

      // 数据发送后处理
      this.plugins.forEach(plugin => {
        plugin.afterSend?.(processedData)
      })
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

  // 销毁实例
  destroy() {
    this.plugins.forEach(plugin => {
      plugin.destroy?.()
    })
    this.plugins.clear()
    this.eventBus.destroy()
  }
}
