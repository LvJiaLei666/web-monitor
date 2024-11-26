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

  eventBus.on(EVENTTYPES.CONSOLEERROR, (errArg: any[]) => {
    console.log(`¬∆¬ ${EVENTTYPES.CONSOLEERROR}`, errArg)
  })

  eventBus.on(EVENTTYPES.CLICK, (e: MouseEvent) => {
    console.log(`¬∆¬ ${EVENTTYPES.CLICK}`, e)
  })

  eventBus.on(EVENTTYPES.LOAD, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.LOAD}`, e)
  })

  eventBus.on(EVENTTYPES.BEFOREUNLOAD, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.BEFOREUNLOAD}`, e)
  })

  eventBus.on(EVENTTYPES.FETCH, (e: Event, fetchStart: number) => {
    console.log(`¬∆¬ ${EVENTTYPES.FETCH}`, e, fetchStart)
  })

  eventBus.on(EVENTTYPES.HASHCHANGE, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.HASHCHANGE}`, e)
  })

  eventBus.on(EVENTTYPES.HISTORYPUSHSTATE, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.HISTORYPUSHSTATE}`, e)
  })

  eventBus.on(EVENTTYPES.HISTORYREPLACESTATE, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.HISTORYREPLACESTATE}`, e)
  })

  eventBus.on(EVENTTYPES.POPSTATE, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.POPSTATE}`, e)
  })

  eventBus.on(EVENTTYPES.ONLINE, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.ONLINE}`, e)
  })

  eventBus.on(EVENTTYPES.OFFLINE, (e: Event) => {
    console.log(`¬∆¬ ${EVENTTYPES.OFFLINE}`, e)
  })
}

export { initError }
