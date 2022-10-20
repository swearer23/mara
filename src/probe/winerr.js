// W3C 关于 ErrorEvent 的文档
// https://w3c.github.io/html/webappapis.html#the-errorevent-interface
// 探针

import { tryStringify } from "../util/util"
import * as stackTraceParser from 'stacktrace-parser'

const ignoredErrors = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications'
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

class WinErr {
  constructor (storage) {
    this.storage = storage
    this.probe()
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
        this.pushLine(`Uncaught (in promise): ${reason}`, '', '', '');
      } else if (typeof reason === 'object') {
        this.pushLine(`Uncaught (in promise): ${tryStringify(reason)}`, '', '', '');
      }
    })
  }

  pushLine (message, url, line, char, err) {
    this.storage.addLine({
      etype: 'JS_ERROR',
      message: `${message} \n ${err && err.stack}`,
      js: `${url}:${line}:${char}`,
    });
    return true;
  }
}

export default WinErr;
