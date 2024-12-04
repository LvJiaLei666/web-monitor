import { EventBus } from '../../utils/eventBus'
import { EVENTTYPES, PERFORMANCE_TYPES, PerformanceEventData } from '../../types/event'

export class PerformanceMonitor {
  constructor(private eventBus: EventBus) {}
  init() {
    this.observeLoad()
    this.observePaint()
    this.observeLCP()
    this.observeFID()
  }

  private createPerformanceEvent(
    type: PERFORMANCE_TYPES,
    data: Partial<PerformanceEventData>
  ): PerformanceEventData {
    return {
      type,
      timestamp: Date.now(),
      pageUrl: document.location.href,
      pageTitle: document.title,
      ...data,
    }
  }

  private observeLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      const metrics = {
        // DNS 解析时间
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        // TCP连接时间
        tcp: navigation.connectEnd - navigation.connectStart,
        // 首字节时间
        ttfb: navigation.responseStart - navigation.requestStart,
        // DOM解析时间
        domParse: navigation.domInteractive - navigation.responseEnd,
        // DOM加载时间
        domReady: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        // 页面完全加载时间
        load: navigation.loadEventEnd - navigation.loadEventStart,
      }

      this.eventBus.emit(
        EVENTTYPES.PERFORMANCE,
        this.createPerformanceEvent(PERFORMANCE_TYPES.TIMING, {
          metrics,
        })
      )
    })
  }

  private observePaint() {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.eventBus.emit(
          EVENTTYPES.PERFORMANCE,
          this.createPerformanceEvent(PERFORMANCE_TYPES.PAINT, {
            name: entry.name,
            startTime: entry.startTime,
          })
        )
      })
    })

    observer.observe({ entryTypes: ['paint'] })
  }

  private observeLCP() {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.eventBus.emit(
        EVENTTYPES.PERFORMANCE,
        this.createPerformanceEvent(PERFORMANCE_TYPES.LCP, {
          value: lastEntry.startTime,
        })
      )
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }

  private observeFID() {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries()

      entries.forEach(entry => {
        if (entry instanceof PerformanceEventTiming) {
          this.eventBus.emit(
            EVENTTYPES.PERFORMANCE,
            this.createPerformanceEvent(PERFORMANCE_TYPES.FID, {
              value: entry.processingStart - entry.startTime,
            })
          )
        }
      })
    })

    observer.observe({ entryTypes: ['first-input'] })
  }
}
