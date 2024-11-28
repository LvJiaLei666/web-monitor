export function logError(message: string) {
  // Error
  console.log(
    '%c[❌ JS-Monitor ERROR]%c',
    'color: red; font-weight: bold;', // 错误类型的颜色
    'color: #000;', // 正文颜色
    message
  )
}

export function logInfo(message: string) {
  console.log(
    '%c[ℹ️ JS-Monitor INFO]%c',
    'color: #4caf50; font-weight: bold;', // 信息类型的绿色
    'color: #000;', // 正文颜色
    message
  )
}

export function logDebug(message: string) {
  console.log(
    '%c[🔍 JS-Monitor DEBUG]%c',
    'color: #ff9800; font-weight: bold;', // 调试类型的橙色
    'color: #000;', // 正文颜色
    message
  )
}
