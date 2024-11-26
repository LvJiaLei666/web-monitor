import { AnyFun, AnyObj } from '../types'
import { isFunction } from './is'

/**
 * 添加监听
 * @param target 监听对象
 * @param eventName 监听事件
 * @param handler 监听函数
 * @param options 是否冒泡
 * */
export function addListener(
  target: Window | Document,
  eventName: string,
  handler: AnyFun,
  options?: boolean | AddEventListenerOptions
) {
  target.addEventListener(eventName, handler, options || false)
}

/**
 * 重写对象上面的某个属性
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @param isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceAop(
  source: AnyObj,
  name: string,
  replacement: AnyFun,
  isForced = false
): void {
  if (source === undefined) return
  if (name in source || isForced) {
    const original = source[name]
    const wrapped = replacement(original)
    if (isFunction(wrapped)) {
      source[name] = wrapped
    }
  }
}
/**
 * 判断对象中是否包含该属性
 * @param key 键
 * @param object 对象
 * @returns 是否包含
 */
export function isInObject(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

/**
 * 获取当前页面的url
 * @returns 当前页面的url
 */
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return ''
  return document.location.href
}

/**
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 * 函数节流
 * @param func 需要节流的函数
 * @param wait 节流的时间间隔
 * @param runFirst 是否需要第一个函数立即执行 (每次)
 * @returns 返回一个包含节流功能的函数
 */
export function throttle(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null
  let lastArgs: any[]

  return function (this: any, ...args: any[]) {
    lastArgs = args

    if (timer === null) {
      if (runFirst) {
        func.apply(this, lastArgs) // 立即执行
      }
      timer = setTimeout(() => {
        timer = null
        if (!runFirst) {
          func.apply(this, lastArgs) // 非立即执行时触发
        }
      }, wait)
    }
  }
}

/**
 * 函数防抖
 * @param func 需要防抖的函数
 * @param wait 防抖的时间间隔
 * @param runFirst 是否需要第一个函数立即执行
 * @returns 返回一个包含防抖功能的函数
 */
export function debounce(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null

  return function (this: any, ...arg: any[]) {
    if (runFirst) {
      func.call(this, ...arg)
      runFirst = false
    }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.call(this, ...arg)
    }, wait)
  }
}
