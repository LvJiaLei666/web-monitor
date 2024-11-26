import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { init } from '@js-monitor/core'
import request from './request.ts'

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
    <div class="error">
        <button id="push-state" type="button">push-state</button>
    </div>
    <div class="history-replaceState">
        <button id="replace-state" type="button">history-replaceState</button>
    </div>
    <div class="history-replaceState">
        <button id="fetch" type="button">fetch请求</button>
    </div>
    <div class="history-replaceState">
        <button id="xhr" type="button">xhr请求</button>
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

function pushState() {
  history.pushState(null, '', '/test-push-state')
}

function replaceState() {
  history.replaceState(null, '', '/test-replace-state')
}

function fetchRequest() {
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(res => {
    console.log('¬∆¬ fetchRequest', res)
  })
}

function xhrRequest() {
  request({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
  }).then(res => {
    console.log('¬∆¬ xhrRequest', res)
  })
}

document.querySelector<HTMLButtonElement>('#error')!.addEventListener('click', triggerError)

document
  .querySelector<HTMLButtonElement>('#promise-error')!
  .addEventListener('click', triggerPromiseError)

document.querySelector<HTMLButtonElement>('#push-state')!.addEventListener('click', pushState)

document.querySelector<HTMLButtonElement>('#replace-state')!.addEventListener('click', replaceState)

document.querySelector<HTMLButtonElement>('#fetch')!.addEventListener('click', fetchRequest)

document.querySelector<HTMLButtonElement>('#xhr')!.addEventListener('click', xhrRequest)

console.error('test console error')
