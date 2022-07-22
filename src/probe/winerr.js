// W3C 关于 ErrorEvent 的文档
// https://w3c.github.io/html/webappapis.html#the-errorevent-interface
// 探针
const probe = (forms, message, url, line, char, err) => {
  forms.addLine({
    etype: 'JS_ERROR',
    msg: `${message} \n ${err && err.stack}`,
    js: `${url}:${line}:${char}`,
  });
  return true;
};

const WinErr = function (forms) {
  this.forms = forms;
};

WinErr.prototype.probe = function () {
  const { onerror } = window;
  window.onerror = (...args) => {
    if (typeof onerror === 'function') onerror.apply(this, args);
    // probe(this.forms, message, url, line);
    probe(this.forms, args[0], args[1], args[2], args[3], args[4]);
  };

  // window.onunhandledrejection = (...args) => {
  //   if (typeof onerror === 'function') onerror.apply(this, args);
  //   probe(this.forms, args[0], args[1], args[2]);
  // }
};

export default WinErr;
