// W3C 关于 ErrorEvent 的文档
// https://w3c.github.io/html/webappapis.html#the-errorevent-interface
// 探针

import { tryStringify } from "../util/util"
import * as stackTraceParser from 'stacktrace-parser'

const ignoredErrors = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications'
]

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
      if (error?.stack?.includes('longju')) {
        const stack = stackTraceParser.parse(error.stack)
        if (stack?.length && stack[0]?.file.includes('public/js/longju/1.0/longju.min.js')) return
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
