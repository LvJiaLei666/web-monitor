export type AnyFun = {
  (...args: any[]): any
}
export type AnyObj<T = any> = {
  [key: string]: T
}
