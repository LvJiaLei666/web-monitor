const { Monitor } = require('@web-monitor/core')

const monitor = new Monitor({
  reportUrl: 'http://localhost:3000/report',
  enableBehavior: true,
  enablePerformance: true,
  enableError: true,
  ignoreUrls: [
    // 忽略所有 .gif 请求
    /\.gif$/,
    // 忽略特定域名
    'example.com/api',
  ],
})

monitor.init()
