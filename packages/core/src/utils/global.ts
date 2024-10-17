import { isWindow } from './is';
import { JsMonitor } from '../constant';

/**
 * 是否为浏览器环境
 */
export const isBrowserEnv = isWindow(typeof window !== 'undefined' ? window : 0);

/**
 * 是否为 electron 环境
 */
export const isElectronEnv = !!window?.process?.versions?.electron;

/**
 * 获取全局变量
 */
export function getGlobal(): Window {
  if (isBrowserEnv || isElectronEnv) return window;
  return {} as Window;
}

export function getGlobalSupport(): JsMonitor {
  _global.__jsMonitor__ = _global.__jsMonitor__ || ({} as JsMonitor);
  return _global.__jsMonitor__;
}

const _global = getGlobal();
const _support = getGlobalSupport();

export { _global, _support };
