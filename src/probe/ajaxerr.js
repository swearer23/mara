import { nanoid } from "nanoid";

const xhrs = {};
const AjaxErr = function (forms) {
  this.forms = forms;
};

const addAjaxError = (forms, status, args) => {
  forms.addLine('ERROR', {
    etype: 'ajax error',
    msg: status,
    js: args.join(' :')
  });
}

const addAjaxTrace = (forms, status, args) => {
  forms.addLine('AJAXTRACE', {
    etype: 'ajax trace',
    msg: status,
    js: args.join(' :')
  });
}

// overwrite XMLHttpRequest
AjaxErr.prototype.probe = function () {
  const that = this;
  const { open, send, setRequestHeader } = XMLHttpRequest.prototype;
  
  XMLHttpRequest.prototype.open = function() {
    const xhrid = nanoid();
    this.__xhrid = xhrid;
    that.addListener(this, arguments);
    open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function() {
    const [key, value] = [...arguments]
    if (key.toLowerCase() === 'content-type' && value.toLowerCase() === 'application/json') {
      xhrs[this.__xhrid].recordPayload = true;
    }
    setRequestHeader.apply(this, arguments);
  }

  XMLHttpRequest.prototype.send = function() {
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
      addAjaxError(this.forms, JSON.stringify(context), [...args]);
    } else {
      addAjaxTrace(this.forms, JSON.stringify(context), [...args]);
    }
  })

  xhr.addEventListener('error', () => {
    addAjaxError(this.forms, xhr.status || 'networkError', [...args]);
  })

  xhr.ontimeout = (...params) => {
    this.forms.addLine('ERROR', {
      etype: 'ajax error',
      msg: `timeout ${xhr.status}`,
      js: args.join(' :'),
    });

    ontimeout && ontimeout.apply(this, params);
  };
};

export default AjaxErr;
