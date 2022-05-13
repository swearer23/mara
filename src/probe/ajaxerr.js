import { nanoid } from "nanoid";

const xhrs = {};
const AjaxErr = function (forms) {
  this.forms = forms;
};

const addAjaxError = (forms, status, args) => {
  forms.addLine('ERROR', {
    etype: 'ajax error',
    msg: `status:${status}`,
    js: args.join(' :')
  });
}

const addAjaxTrace = (forms, status, args) => {
  forms.addLine('AJAXTRACE', {
    etype: 'ajax trace',
    msg: `status:${status}`,
    js: args.join(' :')
  });
}

// overwrite XMLHttpRequest
AjaxErr.prototype.probe = function () {
  const that = this;
  const { open, send } = XMLHttpRequest.prototype;
  
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
    const payload = xhrs[xhr.__xhrid].payload || {}
    const status = `${xhr.status}`;
    const context = {
      status,
      payload: payload,
      response: xhr.response
    }
    if (!/^2[0-9]{1,3}/ig.test(status) && status !== '0') {
      addAjaxError(this.forms, JSON.stringify(context), [...args]);
    } else {
      addAjaxTrace(this.forms, JSON.stringify(context), [...args]);
    }
  })

  xhr.addEventListener('error', () => {
    addAjaxError(this.forms, xhr.status || 'networkError', [...args]);
  })

  // xhr.onloadend = (...params) => {
  //   const status = `${xhr.status}`;
  //   if (!/^2[0-9]{1,3}/ig.test(status) && status !== '0') {
  //     this.forms.addLine('ERROR', {
  //       etype: 'ajax error',
  //       msg: `status:${xhr.status}`,
  //       js: args.join(' :'),
  //     });

  //     onloadend && onloadend.apply(this, params);
  //   }
  // };

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
