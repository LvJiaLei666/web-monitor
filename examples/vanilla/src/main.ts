import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { init } from '@js-monitor/core'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
<!--    <div class="card">-->
<!--      <button id="counter" type="button"></button>-->
<!--    </div>-->
    <div class="error">
        <button id="error" type="button">抛出错误</button>
    </div>
    <div class="error">
        <button id="promise-error" type="button">promise错误</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

init()

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

function triggerError() {
  throw new Error('Something went wrong')
  // const a = ''
  // console.log('¬∆¬ triggerError',a.b.c)
}

function triggerPromiseError() {
  return Promise.reject('Something went wrong')
}

document.querySelector<HTMLButtonElement>('#error')!.addEventListener('click', triggerError)

document
  .querySelector<HTMLButtonElement>('#promise-error')!
  .addEventListener('click', triggerPromiseError)
