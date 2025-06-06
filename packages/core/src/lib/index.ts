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

// 插件优先级
export enum PluginPriority {
  HIGHEST = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
  LOWEST = 4,
}

// 插件接口定义
export interface Plugin {
  name: string
  priority?: PluginPriority
  enabled?: boolean
  init?(monitor: Monitor): void
  onEvent?(eventType: EVENTTYPES, data: MonitorEventData): void
  beforeSend?(data: MonitorEventData): MonitorEventData | false | Promise<MonitorEventData | false>
  afterSend?(data: MonitorEventData): void
  destroy?(): void
}

// 插件配置接口
export interface PluginConfig {
  enabled?: boolean
  [key: string]: any
}

export class Monitor {
  // 参数
  private readonly options: InitOptions
  private plugins = new Map<string, Plugin>()
  private pluginConfigs = new Map<string, PluginConfig>()
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
  use(plugin: Plugin, config?: PluginConfig) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} has already been registered`)
      return this
    }

    // 设置默认优先级和启用状态
    plugin.priority = plugin.priority ?? PluginPriority.NORMAL
    plugin.enabled = config?.enabled ?? true

    // 保存插件配置
    if (config) {
      this.pluginConfigs.set(plugin.name, config)
    }

    this.plugins.set(plugin.name, plugin)

    if (plugin.enabled) {
      plugin.init?.(this)
    }

    return this // 支持链式调用
  }

  // 移除插件
  unuse(pluginName: string) {
    const plugin = this.plugins.get(pluginName)
    if (plugin) {
      plugin.destroy?.()
      this.plugins.delete(pluginName)
      this.pluginConfigs.delete(pluginName)
    }
    return this
  }

  // 启用插件
  enablePlugin(pluginName: string) {
    const plugin = this.plugins.get(pluginName)
    if (plugin && !plugin.enabled) {
      plugin.enabled = true
      plugin.init?.(this)
    }
    return this
  }

  // 禁用插件
  disablePlugin(pluginName: string) {
    const plugin = this.plugins.get(pluginName)
    if (plugin && plugin.enabled) {
      plugin.enabled = false
      plugin.destroy?.()
    }
    return this
  }

  // 获取插件配置
  getPluginConfig<T extends PluginConfig>(pluginName: string): T | undefined {
    return this.pluginConfigs.get(pluginName) as T
  }

  // 设置插件配置
  setPluginConfig(pluginName: string, config: PluginConfig) {
    this.pluginConfigs.set(pluginName, config)
    return this
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
    const handleReport = async (type: EVENTTYPES, data: MonitorEventData) => {
      try {
        // 获取已启用的插件并按优先级排序
        const enabledPlugins = Array.from(this.plugins.values())
          .filter(p => p.enabled)
          .sort(
            (a, b) => (a.priority ?? PluginPriority.NORMAL) - (b.priority ?? PluginPriority.NORMAL)
          )

        // 触发插件的事件处理
        enabledPlugins.forEach(plugin => {
          plugin.onEvent?.(type, data)
        })

        // 数据发送前处理
        let processedData = data
        for (const plugin of enabledPlugins) {
          if (!plugin.beforeSend) continue

          const result = await Promise.resolve(plugin.beforeSend(processedData))
          if (result === false) {
            return // 如果插件返回 false，则不上报数据
          }
          if (result) {
            processedData = result
          }
        }

        // 发送数据
        await this.reporter.send(type, processedData)

        // 数据发送后处理
        enabledPlugins.forEach(plugin => {
          plugin.afterSend?.(processedData)
        })
      } catch (error) {
        console.error('Error in handleReport:', error)
      }
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
      if (plugin.enabled) {
        plugin.destroy?.()
      }
    })
    this.plugins.clear()
    this.pluginConfigs.clear()
    this.eventBus.destroy()
  }
}
