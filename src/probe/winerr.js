// W3C 关于 ErrorEvent 的文档
// https://w3c.github.io/html/webappapis.html#the-errorevent-interface
// 探针

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
      for (let i = 0; i < ignoredErrors.length; i++) {
        if (message.indexOf(ignoredErrors[i]) === 0) {
          console.warn('Ignored error:', message);
          return
        }
      }
      this.pushLine(message, filename, lineno, colno, error);
    })

    window.addEventListener("unhandledrejection", event => {
      throw event.reason
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
