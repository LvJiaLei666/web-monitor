/**
 * init配置项
 * */
export interface InitOptions {
  reportUrl: string
  // 是否使用image上报
  useImageUpload: boolean
  // 上报方式 默认使用sendBeacon 如不兼容逐步降级至img 最后是xhr
  // customReportType?: 'sendBeacon' | 'img' | 'fetch' | 'xhr'
  // 忽略监控与上报的url列表
  ignoreUrls?: (string | RegExp)[]
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

export const defaultOptions: InitOptions = {
  reportUrl: '',
  ignoreUrls: [],
  appId: '',
  userId: '',
  sampleRate: 1,
  enableError: false,
  enablePerformance: false,
  enableBehavior: false,
  useImageUpload: false,
}

// 检查配置项
export function checkOptions(options: InitOptions) {
  if (!options.reportUrl) {
    throw new Error('web-monitor : reportUrl is required')
  }
}
