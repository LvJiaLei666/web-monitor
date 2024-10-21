import { EVENTTYPES } from '../constant'
import { eventBus } from './eventBus'

function initError() {
  console.log('initError')
  eventBus.on(EVENTTYPES.ERROR, (err: ErrorEvent) => {
    console.log(`¬∆¬ ${EVENTTYPES.ERROR}`, err)
  })

  eventBus.on(EVENTTYPES.UNHANDLEDREJECTION, (err: PromiseRejectionEvent) => {
    console.log(`¬∆¬ ${EVENTTYPES.UNHANDLEDREJECTION}`, err)
  })
}

export { initError }
