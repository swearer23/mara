// W3C 关于 ErrorEvent 的文档
// https://w3c.github.io/html/webappapis.html#the-errorevent-interface
// 探针

class WinErr {
  constructor (storage) {
    this.storage = storage
    this.probe()
  }

  probe () {
    const { onerror } = window;
    window.onerror = (...args) => {
      if (typeof onerror === 'function') onerror.apply(this, args);
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
