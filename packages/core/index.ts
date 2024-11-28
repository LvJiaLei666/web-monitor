import { initError } from './src/lib/err'
import { initListenerAndReplace } from './src/lib/replace'
import { InitOptions } from './src/types/options'
import { initOptions } from './src/lib/init'
import { isEmpty } from './src/utils/is'
import { logError } from './src/utils/log'

function init(options: InitOptions) {
  // 处理入口配置 挂载全局变量 挂载eventBus
  console.log('init')

  if (!options || isEmpty(options)) {
    logError('请输入正确的配置项')
    return
  }

  if (!options.apiKey || !options.reportUrl) {
    logError(`${!options.apiKey ? 'apiKey' : 'reportUrl'}为空，请输入正确的配置项`)
    return
  }

  initOptions(options)
  initListenerAndReplace()
  initError()
}

export { init }
