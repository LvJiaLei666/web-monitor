import { MonitorEventData } from '../../types/event'

export class Reporter {
  constructor(private reportUrl: string) {}
  send(data: MonitorEventData) {
    if (!this.reportUrl) return
    console.log('¬∆¬ send', data)
  }
}
