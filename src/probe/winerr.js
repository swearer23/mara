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
    const { onerror } = window;
    window.onerror = (...args) => {
      if (typeof onerror === 'function') onerror.apply(this, args);
      for (let i = 0; i < ignoredErrors.length; i++) {
        if (args[0].indexOf(ignoredErrors[i]) === 0) return
      }
      // probe(this.forms, message, url, line);
      this.pushLine(args[0], args[1], args[2], args[3], args[4]);
    };
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
