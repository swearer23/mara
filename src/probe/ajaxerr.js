import { nanoid } from "nanoid";

const xhrs = {};

const tryStringify = obj => {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return 'not_serializable'
  }
}

const initXhr = () => {
  return {
    headers: {},
    payload: {},
    response: {},
    xhrObject: null
  }
}

class AjaxErr {
  constructor (storage) {
    this.storage = storage
    this.probe()
  }

  probe () {
    const that = this;
    const { open, send, setRequestHeader } = XMLHttpRequest.prototype;

    XMLHttpRequest.prototype.open = function() {
      this.__xhrid = nanoid();
      xhrs[this.__xhrid] = initXhr();
      that.addListener(this, arguments);
      open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function() {
      if (!this.__xhrid) return setRequestHeader.apply(this, arguments);
      const [key, value] = [...arguments]
      xhrs[this.__xhrid].headers[key] = value;
      setRequestHeader.apply(this, arguments);
    }

    XMLHttpRequest.prototype.send = function() {
      if (!this.__xhrid) return send.apply(this, arguments);
      xhrs[this.__xhrid].payload = [...arguments];
      send.apply(this, arguments);
    }
  }

  addListener (xhr, args) {
    const that = this
    if (xhrs[xhr.__xhrid].xhrObject) return;
    xhrs[xhr.__xhrid].xhrObject = { xhr }

    const { ontimeout } = xhr;

    xhr.addEventListener('loadend', () => {
      console.log(xhr)
      const { statusText, status, response } = xhr;
      let { payload, headers } = xhrs[xhr.__xhrid]
      const context = {
        statusText,
        payload,
        headers,
        status,
        response
      }
      if (parseInt(status) === 0) return
      if (!/^2[0-9]{1,3}/ig.test(status)) {
        that.addAjaxError(context, [...args]);
      }
    })

    xhr.addEventListener('error', () => {
      that.addAjaxError({
        networkError: true,
        statusText: xhr.statusText || 'network error',
      }, [...args]);
    })

    xhr.ontimeout = (...params) => {
      that.addAjaxError({
        networkError: true,
        statusText: xhr.statusText
      }, [...args]);
      ontimeout && ontimeout.apply(this, params);
    };
  }

  addAjaxError (context, args) {
    const line = {
      etype: 'API_ERROR',
      networkError: context.networkError || false,
      status: context.statusText,
      statusCode: context.status,
      request: {
        method: args[0],
        url: args[1]
      }
    }
    context.payload && (line.payload = tryStringify(context.payload))
    context.response && (line.response= tryStringify(context.response))
    context.headers && (line.headers = tryStringify(context.headers))
    this.storage.addLine(line);
  }
}

export default AjaxErr;
