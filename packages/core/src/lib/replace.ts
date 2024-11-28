import { EVENTTYPES } from '../constant'
import { addListener, getTimestamp, isInObject, replaceAop, throttle } from '../utils'
import { eventBus } from './eventBus'
import { _global, _support } from '../utils/global'
import { VoidFun } from '../types'

function initListenerAndReplace() {
  for (const key of _support.needMountEvent) {
    if (isInObject(key, EVENTTYPES)) {
      replace(EVENTTYPES[key])
    }
  }
}

function replace(type: EVENTTYPES) {
  switch (type) {
    case EVENTTYPES.ERROR:
      initError()
      break
    case EVENTTYPES.UNHANDLEDREJECTION:
      initPromiseError()
      break
    case EVENTTYPES.CONSOLEERROR:
      initConsoleError()
      break

    case EVENTTYPES.CLICK:
      initClick()
      break

    case EVENTTYPES.LOAD:
      initLoad()
      break

    case EVENTTYPES.BEFOREUNLOAD:
      initBeforeUnload()
      break

    case EVENTTYPES.FETCH:
      initFetch()
      break

    case EVENTTYPES.XHROPEN:
      initXhrOpen()
      break

    case EVENTTYPES.XHRSEND:
      initXhrSend()
      break

    case EVENTTYPES.HASHCHANGE:
      initHashChange()
      break

    case EVENTTYPES.HISTORYPUSHSTATE:
      initHistoryPushState()
      break

    case EVENTTYPES.HISTORYREPLACESTATE:
      initHistoryReplaceState()
      break

    case EVENTTYPES.POPSTATE:
      initPopState()
      break

    case EVENTTYPES.ONLINE:
      initOnline()
      break

    case EVENTTYPES.OFFLINE:
      initOffline()
      break

    default:
      break
  }
}

function initError() {
  addListener(
    _global,
    EVENTTYPES.ERROR,
    (err: ErrorEvent) => eventBus.emit(EVENTTYPES.ERROR, err),
    true
  )
}

function initPromiseError() {
  addListener(
    _global,
    EVENTTYPES.UNHANDLEDREJECTION,
    (err: PromiseRejectionEvent) => eventBus.emit(EVENTTYPES.UNHANDLEDREJECTION, err),
    true
  )
}

function initConsoleError() {
  replaceAop(console, 'error', (originalError: VoidFun) => {
    return function (this: any, ...arg: any[]) {
      eventBus.emit(EVENTTYPES.CONSOLEERROR, arg)
      originalError.apply(this, arg)
    }
  })
}

function initClick() {
  if (!('document' in _global)) return
  const clickThrottle = throttle(eventBus.emit, 100, true)
  addListener(
    _global.document,
    EVENTTYPES.CLICK,
    (e: MouseEvent) => {
      clickThrottle.call(eventBus, EVENTTYPES.CLICK, e)
    },
    true
  )
}

function initLoad() {
  addListener(
    _global,
    EVENTTYPES.LOAD,
    (e: Event) => {
      eventBus.emit(EVENTTYPES.LOAD, e)
    },
    true
  )
}

function initBeforeUnload() {
  addListener(
    _global,
    EVENTTYPES.BEFOREUNLOAD,
    (e: Event) => {
      eventBus.emit(EVENTTYPES.BEFOREUNLOAD, e)
    },
    true
  )
}

function initFetch() {
  if (!('fetch' in _global)) return
  replaceAop(_global, 'fetch', originalFetch => {
    return function (this: any, ...arg: any[]) {
      const fetchStart = getTimestamp()
      return originalFetch.apply(_global, arg).then((res: any) => {
        eventBus.emit(EVENTTYPES.FETCH, arg, fetchStart)
        return res
      })
    }
  })
}

function initXhrOpen() {
  if (!('XMLHttpRequest' in _global)) return
  replaceAop(XMLHttpRequest.prototype, 'open', originalOpen => {
    return function (this: any, ...arg: any[]) {
      eventBus.emit(EVENTTYPES.XHROPEN, arg)
      console.log('¬∆¬ XMLHttpRequest open')
      return originalOpen.apply(this, arg)
    }
  })
}

function initXhrSend() {
  if (!('XMLHttpRequest' in _global)) return
  replaceAop(XMLHttpRequest.prototype, 'send', originalSend => {
    return function (this: any, ...arg: any[]) {
      eventBus.emit(EVENTTYPES.XHRSEND, arg)
      console.log('¬∆¬ XMLHttpRequest send')
      return originalSend.apply(this, arg)
    }
  })
}

function initHashChange() {
  addListener(
    _global,
    EVENTTYPES.HASHCHANGE,
    (e: HashChangeEvent) => {
      eventBus.emit(EVENTTYPES.HASHCHANGE, e)
    },
    true
  )
}

function initHistoryPushState() {
  if (!('history' in _global)) return
  if (!('pushState' in _global.history)) return
  replaceAop(_global.history, 'pushState', originalPushState => {
    return function (this: any, ...arg: any[]) {
      eventBus.emit(EVENTTYPES.HISTORYPUSHSTATE, arg)
      return originalPushState.apply(this, arg)
    }
  })
}

function initHistoryReplaceState() {
  if (!('history' in _global)) return
  if (!('replaceState' in _global.history)) return
  replaceAop(_global.history, 'replaceState', originalReplaceState => {
    return function (this: any, ...arg: any[]) {
      eventBus.emit(EVENTTYPES.HISTORYREPLACESTATE, arg)
      return originalReplaceState.apply(this, arg)
    }
  })
}

function initPopState() {
  addListener(_global, EVENTTYPES.POPSTATE, (e: PopStateEvent) => {
    eventBus.emit(EVENTTYPES.POPSTATE, e)
  })
}

function initOnline() {
  addListener(_global, EVENTTYPES.ONLINE, (e: Event) => {
    eventBus.emit(EVENTTYPES.ONLINE, e)
  })
}

function initOffline() {
  addListener(_global, EVENTTYPES.OFFLINE, (e: Event) => {
    eventBus.emit(EVENTTYPES.OFFLINE, e)
  })
}

export { initListenerAndReplace }
