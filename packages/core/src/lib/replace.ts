import { EVENTTYPES } from '../constant'
import { addListener, isInObject } from '../utils'
import { eventBus } from './eventBus'
import { _global } from '../utils/global'

function initListenerAndReplace() {
  console.log('initListenerAndReplace')
  for (const key in EVENTTYPES) {
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

export { initListenerAndReplace }
