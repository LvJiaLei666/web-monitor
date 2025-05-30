import { Monitor } from '@web-monitor/core'

const monitor = new Monitor({
  reportUrl: 'http://localhost:3000/report',
  enableBehavior: true,
  enablePerformance: true,
  enableError: true,
  ignoreUrls: [
    // 忽略所有图片请求
    /\.(png|jpg|gif)$/,
    // 忽略分析相关请求
    'analytics.com',
  ],
})

monitor.init()
