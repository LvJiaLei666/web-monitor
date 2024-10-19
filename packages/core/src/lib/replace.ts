import { EVENTTYPES } from '../constant'
import { isInObject } from '../utils'

function initListenerAndReplace() {
  console.log('initListenerAndReplace')
  const replace = (type: EVENTTYPES) => {}
  for (const key in EVENTTYPES) {
    if (isInObject(key, EVENTTYPES)) {
      replace(key)
    }
  }
}

export { initListenerAndReplace }
