import { defaultOptions, InitOptions } from '../types/options'
import { _support } from '../utils/global'
import { EVENTTYPES } from '../constant'

export function initOptions(options: InitOptions) {
  // 初始化 options 和 needMountEvent
  _support.options = { ...defaultOptions, ...options }
  _support.needMountEvent = []

  // 映射事件监听的条件和对应的事件类型
  const eventMap: { [key: string]: EVENTTYPES[] } = {
    listeningXhr: [EVENTTYPES.XHROPEN, EVENTTYPES.XHRSEND],
    listeningFetch: [EVENTTYPES.FETCH],
    listeningUnhandledRejection: [EVENTTYPES.UNHANDLEDREJECTION],
    listeningHashchange: [EVENTTYPES.HASHCHANGE],
    listeningPopstate: [EVENTTYPES.POPSTATE],
    listeningClick: [EVENTTYPES.CLICK],
  }

  // 遍历 eventMap，将需要监听的事件类型推入 needMountEvent
  Object.entries(eventMap).forEach(([key, events]) => {
    if (options[key as keyof InitOptions]) {
      _support.needMountEvent.push(...events)
    }
  })
}
