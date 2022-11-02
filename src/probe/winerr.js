// W3C 关于 ErrorEvent 的文档
// https://w3c.github.io/html/webappapis.html#the-errorevent-interface
// 探针

import { tryStringify } from "../util/util"
import * as stackTraceParser from 'stacktrace-parser'

const ignoredErrors = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications',
  'Uncaught ReferenceError: __wm_capture_callback__ is not defined'
]

const isIgnoredError = (stackString, filename, line, col) => {
  const stack = stackTraceParser.parse(stackString)
  if (!stack) return
  if (stack.length === 0) return
  const firstStack = stack[0]
  if (!firstStack.file.includes(filename)) return
  if (firstStack.lineNumber !== line) return
  if (firstStack.column !== col) return
  return true
}

class VueErrorCollector {
  constructor(onErrorDetected) {
    this.onErrorDetected = onErrorDetected
    this.tryToDetect()
  }

  async tryToDetect() {
    let count = 5,
        vue
    while(count > 0) {
      vue = this.detect()
      if (vue) {
        this.setErrorHandler(vue)
      } else {
        count--
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  setErrorHandler (vue) {
    const originErrorHandler = vue.config.errorHandler
    const maraVueErrorHandler = (err, vm, info) => {
      if (originErrorHandler && originErrorHandler.name !== 'maraVueErrorHandler') {
        originErrorHandler && originErrorHandler(err, vm, info)
      }
      console.error(err)
      this.onErrorDetected(info, '', '', '', err, 'VUE_ERROR')
    }
    vue.config.errorHandler = maraVueErrorHandler
  }

  detect() {
    const all = document.querySelectorAll('*')
    let el
    for (let i = 0; i < all.length; i++) {
      if (all[i].__vue__) {
        el = all[i]
        break
      }
    }
    if (el) {
      let Vue = Object.getPrototypeOf(el.__vue__).constructor
      while (Vue.super) {
        Vue = Vue.super
      }
      return Vue
    }
    return false
  }

}

class WinErr {
  constructor (storage) {
    this.storage = storage
    new VueErrorCollector(this.onErrorDetected.bind(this))
    this.probe()
  }

  onErrorDetected() {
    this.pushLine.apply(this, arguments)
  }

  probe () {
    window.addEventListener('error' , errorEvent => {
      const {
        message,
        filename,
        lineno,
        colno,
        error
      } = errorEvent;
      if (error?.stack?.includes('longju') && isIgnoredError(error.stack, 'longju.min.js', 4, 158931)) {
        console.log('ignore longju error')
        return
      }
      for (let i = 0; i < ignoredErrors.length; i++) {
        if (message.indexOf(ignoredErrors[i]) === 0) {
          console.warn('Ignored error:', message);
          return
        }
      }
      this.pushLine(message, filename, lineno, colno, error);
    })

    window.addEventListener("unhandledrejection", (event) => {
      const { reason } = event;
      if (reason?.isAxiosError) {
        return console.log('Axios Error:', event)
      }
      if (reason instanceof Error) {
        this.pushLine(reason.message, reason.fileName, reason.lineNumber, reason.columnNumber, reason);
      } else if (typeof reason === 'string') {
        this.pushLine(`Uncaught (in promise): ${reason}`, '', '', '', null, 'JS_WARN');
      } else if (typeof reason === 'object') {
        this.pushLine(`Uncaught (in promise): ${tryStringify(reason)}`, '', '', '', null, 'JS_WARN');
      }
    })
  }

  pushLine (message, url, line, char, err, etype='JS_ERROR') {
    this.storage.addLine({
      etype,
      message: `${message} \n ${err && err.stack}`,
      js: `${url}:${line}:${char}`,
    });
    return true;
  }
}

export default WinErr;
