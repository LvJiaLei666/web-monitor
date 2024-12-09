import { EVENTTYPES, MonitorEventData } from '../../types/event'
import { InitOptions } from '../../types/options'
export class Reporter {
  constructor(private options: InitOptions) {}
  private sendBeaconReport(data: MonitorEventData) {
    console.log('¬∆¬ sendBeaconReport', JSON.stringify(data))
    navigator.sendBeacon(this.options.reportUrl, JSON.stringify(data))
  }
  private sendImageReport(data: MonitorEventData) {
    const image = new Image()
    const connector = this.options.reportUrl.includes('?') ? '&' : '?'
    image.src = `${this.options.reportUrl}${connector}data=${encodeURIComponent(
      JSON.stringify(data)
    )}`
  }
  private sendFetchReport(data: MonitorEventData) {
    fetch(this.options.reportUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  private sendXhrReport(data: MonitorEventData) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', this.options.reportUrl, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
  }
  private defaultSendReport(data: MonitorEventData) {
    if (typeof navigator.sendBeacon === 'function') {
      this.sendBeaconReport(data)
    } else if (typeof fetch === 'function') {
      // fetch
      this.sendFetchReport(data)
    } else {
      // xhr
      this.sendXhrReport(data)
    }
  }
  send(type: EVENTTYPES, data: MonitorEventData) {
    const _data = { ...data, eventType: type }
    if (this.options.useImageUpload) {
      this.sendImageReport(_data)
    } else {
      this.defaultSendReport(_data)
    }
  }
}
