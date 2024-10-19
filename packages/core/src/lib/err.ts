import { addListener } from '../utils'
import { EVENTTYPES } from '../constant'
import { eventBus } from './eventBus'

function initError() {
  console.log('initError')
  addListener(window, EVENTTYPES.ERROR, err => {
    eventBus.emit(EVENTTYPES.ERROR, err)
  })
}

export { initError }
