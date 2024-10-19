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
