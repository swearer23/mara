import { nanoid } from "nanoid";

const xhrs = {};
const AjaxErr = function (forms) {
  this.forms = forms;
};

const addAjaxError = (forms, status, args) => {
  forms.addLine({
    etype: 'ajax error',
    msg: status,
    js: args.join(' :')
  });
}

const addAjaxTrace = (forms, status, args) => {
  forms.addLine({
    etype: 'ajax trace',
    msg: status,
    js: args.join(':')
  });
}

// overwrite XMLHttpRequest
AjaxErr.prototype.probe = function (logAjaxTrace = false, excludeKeywords) {
  const that = this;
  this.logAjaxTrace = logAjaxTrace
  this.excludeKeywords = excludeKeywords || []
  const { open, send, setRequestHeader } = XMLHttpRequest.prototype;

  const excludeURLFilter = url => {
    for (let i = 0; i < this.excludeKeywords.length; i++) {
      if (url.indexOf(this.excludeKeywords[i]) !== -1) {
        return true
      }
    }
    return false
  }
  
  XMLHttpRequest.prototype.open = function() {
    const args = [...arguments]
    if (args[1] && excludeURLFilter(args[1])) return open.apply(this, arguments)
    const xhrid = nanoid();
    this.__xhrid = xhrid;
    that.addListener(this, arguments);
    open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function() {
    if (!this.__xhrid) return setRequestHeader.apply(this, arguments);
    const [key, value] = [...arguments]
    if (key.toLowerCase() === 'content-type' && value.toLowerCase().includes('application/json')) {
      xhrs[this.__xhrid].recordPayload = true;
    }
    setRequestHeader.apply(this, arguments);
  }

  XMLHttpRequest.prototype.send = function() {
    if (!this.__xhrid) return send.apply(this, arguments);
    if (xhrs[this.__xhrid].recordPayload) {
      xhrs[this.__xhrid].payload = [...arguments];
    }
    send.apply(this, arguments);
  }
};

AjaxErr.prototype.addListener = function (xhr, args) {
  if (xhrs[xhr.__xhrid]) return;
  xhrs[xhr.__xhrid] = { xhr }

  const { ontimeout } = xhr;

  xhr.addEventListener('loadend', () => {
    const status = xhr.status
    let payload = xhrs[xhr.__xhrid].payload || {}
    try {
      payload = JSON.parse(payload)
    } catch (err) {
      payload = payload
    }
    let response
    try {
      response = JSON.parse(xhr.response)
    } catch (err) {
      response = xhr.response
    }
    const context = {
      status,
      payload,
      response
    }
    if (parseInt(status) === 0) return
    if (!/^2[0-9]{1,3}/ig.test(status)) {
      addAjaxError(this.forms, context, [...args]);
    } else {
      if (this.logAjaxTrace)
        addAjaxTrace(this.forms, context, [...args]);
    }
  })

  xhr.addEventListener('error', () => {
    addAjaxError(this.forms, xhr.status || 'networkError', [...args]);
  })

  xhr.ontimeout = (...params) => {
    this.forms.addLine({
      etype: 'ajax error',
      msg: `timeout ${xhr.status}`,
      js: args.join(' :'),
    });

    ontimeout && ontimeout.apply(this, params);
  };
};

export default AjaxErr;
