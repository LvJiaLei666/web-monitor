# Web Monitor SDK

一个轻量级的前端监控 SDK，采用 OOP 与 FP 相结合的方式实现，支持错误监控、性能监控和用户行为监控。

## 特性

-[x] 🚀 轻量级，零依赖
-[x] 🎯 支持错误监控（JS异常、Promise异常、资源加载异常）
-[x] 📊 支持性能监控（页面加载性能、绘制性能、核心性能指标）
-[x] 🔍 支持用户行为监控（点击行为、页面跳转）
-[x] 🔌 插件化架构，支持自定义扩展
-[ ] 🌊 支持采样率控制
-[ ] 💾 支持离线缓存
-[ ] 🔄 支持数据压缩

## 安装

```bash
npm install web-monitor-sdk
# 或
yarn add web-monitor-sdk
```

## 快速开始

```typescript
import { Monitor } from 'web-monitor-sdk'

const monitor = new Monitor({
  reportUrl: 'https://your-report-url.com/collect',
  appId: 'your-app-id',
  userId: 'user-id',
  // 启用的监控类型
  enableError: true,
  enablePerformance: true,
  enableBehavior: true,
  // 采样率
  sampleRate: 1
})

monitor.init()
```

## 监控类型

### 错误监控
- JS 运行时错误
- Promise 未处理的 rejection
- 资源加载错误（图片、脚本、样式表等）

### 性能监控
- DNS 解析时间
- TCP 连接时间
- 首字节时间（TTFB）
- DOM 解析时间
- 页面加载完成时间
- First Paint (FP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)

### 行为监控
- 页面点击事件
- 路由变化
- Hash 变化

## 插件系统

SDK 支持通过插件进行功能扩展：

```typescript
// 采样率插件示例
const samplingPlugin = {
  name: 'sampling',
  beforeSend(data) {
    return Math.random() < 0.1 ? data : false // 10% 采样率
  }
}

// 用户信息插件示例
const userPlugin = {
  name: 'user',
  beforeSend(data) {
    return {
      ...data,
      userId: localStorage.getItem('userId'),
      userInfo: {
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      }
    }
  }
}

// 使用插件
monitor.use(samplingPlugin)
monitor.use(userPlugin)
```

## 插件 API

插件可以实现以下生命周期方法：

```typescript
interface Plugin {
  name: string;
  init?(monitor: Monitor): void;
  onEvent?(eventType: EVENTTYPES, data: any): void;
  beforeSend?(data: any): any | false;
  afterSend?(data: any): void;
  destroy?(): void;
}
```

## 数据上报格式

```typescript
interface MonitorEvent {
  timestamp: number;
  type: 'error' | 'performance' | 'behavior';
  data: ErrorData | PerformanceData | BehaviorData;
}
```

## 注意事项

1. 建议在页面早期初始化监控 SDK
2. 合理设置采样率，避免产生过多数据
3. 监控上报接口应该是高可用的
4. 建议使用 navigator.sendBeacon 进行数据上报
5. 注意防止监控代码影响业务代码的性能

## License

MIT
