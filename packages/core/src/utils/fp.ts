import { AnyFun } from '../types'

export const pipe = (...fns: AnyFun[]) => {
  return function (this: any, ...args: any[]) {
    return fns.reduce((result, fn) => {
      // 使用 fn.apply(this, args) 来确保正确的 `this` 和传递给下一个函数的参数
      return fn.apply(this, [result, ...args.slice(1)])
    }, args[0]) // 初始值是第一个参数 args[0]
  }
}
