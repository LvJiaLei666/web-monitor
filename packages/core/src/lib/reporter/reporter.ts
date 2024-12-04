import { MonitorEventData } from '../../types/event'
import { InitOptions } from '../../types/options'

export class Reporter {
  constructor(private options: InitOptions) {}
  private sendBeaconReport(data: MonitorEventData) {
    navigator.sendBeacon(this.options.reportUrl, JSON.stringify(data))
  }
  private sendImageReport(data: MonitorEventData) {}
  private sendFetchReport(data: MonitorEventData) {}
  private sendXhrReport(data: MonitorEventData) {}
  private defaultSendReport(data: MonitorEventData) {
    if (navigator.sendBeacon) {
      this.sendBeaconReport(data)
    } else if (fetch) {
      // fetch
      this.sendFetchReport(data)
    } else {
      // xhr
      this.sendXhrReport(data)
    }
  }
  send(data: MonitorEventData) {
    if (this.options.useImageUpload) {
      this.sendImageReport(data)
    } else {
      this.defaultSendReport(data)
    }
  }
}
