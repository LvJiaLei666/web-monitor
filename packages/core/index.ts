import { initError } from './src/lib/err'
import { initListenerAndReplace } from './src/lib/replace'

function init() {
  console.log('init')
  initListenerAndReplace()
  initError()
}

export { init }
