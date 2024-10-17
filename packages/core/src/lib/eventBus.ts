import { EVENTTYPES } from '../constant';
import { AnyFn } from '../types';
import { _support } from '../utils/global';

type Events = {
  [key in EVENTTYPES]?: AnyFn[];
};

export class EventBus {
  private readonly events: Events = {};

  // 订阅
  on(eventName: EVENTTYPES, handler: AnyFn): void {
    const callbacks = this.events[eventName] ?? (this.events[eventName] = []);
    if (!this.hasHandler(callbacks, handler)) {
      callbacks.push(handler);
    }
  }

  // 移除订阅
  off(eventName: EVENTTYPES, handler: AnyFn): void {
    const callbacks = this.events[eventName];
    if (!callbacks) return;

    const callbackIndex = this.getCallbackIndex(callbacks, handler);
    if (callbackIndex !== -1) {
      callbacks.splice(callbackIndex, 1);
    }
  }

  // 发布
  emit(eventName: EVENTTYPES, ...args: any[]): void {
    this.events[eventName]?.forEach(callback => {
      callback(...args);
    });
  }

  // 获取回调函数的索引
  private getCallbackIndex(callbacks: AnyFn[], handler: AnyFn): number {
    return callbacks.findIndex(fn => fn === handler);
  }

  // 检查回调函数是否已经存在
  private hasHandler(callbacks: AnyFn[], handler: AnyFn): boolean {
    return this.getCallbackIndex(callbacks, handler) !== -1;
  }
}

export const eventBus = _support.eventBus || (_support.eventBus = new EventBus());
