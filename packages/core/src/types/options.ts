/**
 * init配置项
 * */
export type InitOptions = {
  // 上报地址
  reportUrl: string
  // 项目唯一id
  apiKey: string
  // 是否开启调试
  debug?: boolean
  // 是否禁用
  disable?: boolean
  // 是否监听xhr
  listeningXhr?: boolean
  // 是否监听fetch
  listeningFetch?: boolean
  // 接口超时时长
  xhrTimeout?: number
  // 过滤接口正则
  xhrFilter?: RegExp
  // 是否监听unhandledRejection
  listeningUnhandledRejection?: boolean
  // 是否监听hashchange
  listeningHashchange?: boolean
  // 是否监听popstate
  listeningPopstate?: boolean
  // 是否监听点击事件
  listeningClick?: boolean
  // 点击事件节流时长
  clickThrottleDuration?: number
  // 上报频率（存放多少条上报）
  reportFrequency?: number
  // 是否使用图片上报
  useImageReport?: boolean
  // 添加到行为列表前
  beforeAddBehavior?: (behavior: any) => any
  // 上报前
  beforeReport?: (data: any) => any
  // 接口是否返回正常
  isNormalResponse?: (response: any) => boolean

  // 白屏检测 todo
  whiteScreen?: boolean
  // 白屏检测容器列表 todo
  whiteScreenSelector?: string[]
  // 是否开启性能检测 todo
  performance?: boolean
}

export const defaultOptions: InitOptions = {
  reportUrl: '',
  apiKey: '',
  debug: false,
  disable: false,
  listeningXhr: true,
  listeningFetch: true,
  xhrTimeout: 3000,
  listeningUnhandledRejection: true,
  listeningHashchange: true,
  listeningPopstate: true,
  listeningClick: true,
  clickThrottleDuration: 100,
  reportFrequency: 100,
  useImageReport: false,
  beforeAddBehavior: () => {},
  beforeReport: () => {},
  isNormalResponse: (response: any) => {
    return response.status >= 200 && response.status < 400
  },
}
