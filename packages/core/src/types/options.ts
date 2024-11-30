/**
 * init配置项
 * */
export interface InitOptions {
  reportUrl: string
  appId?: string
  userId?: string
  // 采样率
  sampleRate?: number
  // 是否启用错误监控
  enableError?: boolean
  // 是否启用性能监控
  enablePerformance?: boolean
  // 是否启用行为监控
  enableBehavior?: boolean
}

export interface MonitorEvent {
  timestamp: number
  type: 'error' | 'performance' | 'behavior'
  data: any
}
