import { EVENTTYPES } from '../types/event'
import { VoidFun } from '../types'

export class EventBus {
  private handlers: Map<EVENTTYPES, VoidFun[]> = new Map()

  public on(type: EVENTTYPES, handler: VoidFun) {
    const handlers = this.handlers.get(type) || []
    handlers.push(handler)
    this.handlers.set(type, handlers)
  }
  public emit(type: EVENTTYPES, ...arg: any[]) {
    const handlers = this.handlers.get(type) || []
    handlers.forEach(item => item && item(...arg))
  }
  public off(type: EVENTTYPES, handler: VoidFun) {
    const handlers = this.handlers.get(type) || []
    const index = handlers.indexOf(handler)
    if (index > -1) handlers.splice(index, 1)
  }
  public destroy() {
    this.handlers.clear()
  }
}
