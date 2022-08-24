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
    xhrObject: null,
    xhrOpenedAt: window.performance && window.performance.now()
  }
}

class AjaxErr {
  constructor (storage, options = {
    autoTraceId,
    slowAPIThreshold,
    traceIdKey,
    slowAPIThreshold,
    sessionId,
    sessionIdKey,
    onApiMeasured,
    excludeAjaxURL
  }) {
    this.storage = storage
    this.autoTraceId = options.autoTraceId
    this.slowAPIThreshold = options.slowAPIThreshold
    this.traceIdKey = options.traceIdKey
    this.slowAPIThreshold = options.slowAPIThreshold
    this.sessionId = options.sessionId
    this.sessionIdKey = options.sessionIdKey
    this.onApiMeasured = options.onApiMeasured
    if (options.excludeAjaxURL)
      this.excludeAjaxURLRegex = new RegExp(`(${options.excludeAjaxURL.join('|')})$`)
    this.probe()
  }

  probe () {
    const that = this;
    const { open, send, setRequestHeader } = XMLHttpRequest.prototype;

    XMLHttpRequest.prototype.open = function() {
      if (that.excludeAjaxURLRegex?.test(arguments[1])) {
        open.apply(this, arguments)
        return
      }
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
      if (that.autoTraceId) {
        this.setRequestHeader(that.traceIdKey, nanoid(16));
        this.setRequestHeader(that.sessionIdKey, that.sessionId);
      }
      if (that.slowAPIThreshold) {
        xhrs[this.__xhrid].startTime = Date.now();
      }
      if (!this.__xhrid) return send.apply(this, arguments);
      xhrs[this.__xhrid].payload = [...arguments];
      send.apply(this, arguments);
    }
  }

  addListener (xhr, args) {
    const that = this
    if (xhrs[xhr.__xhrid].xhrObject) return;
    xhrs[xhr.__xhrid].xhrObject = xhr

    const { ontimeout } = xhr;

    xhr.addEventListener('readystatechange', () => {
      if (window.performance && xhrs[xhr.__xhrid]) {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED)
          xhrs[xhr.__xhrid].startRequestAt = window.performance.now()
        if (xhr.readyState === XMLHttpRequest.LOADING)
          xhrs[xhr.__xhrid].startReceiveAt = window.performance.now()
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          xhrs[xhr.__xhrid].completedAt = window.performance.now()
          this.onApiMeasured(Object.assign({}, xhrs[xhr.__xhrid]), [...args], this.traceIdKey)
        }
      }
    })

    xhr.addEventListener('loadend', () => {
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
        return that.addAjaxError(context, [...args]);
      }
      if (that.slowAPIThreshold) {
        const serverTiming = new Number(xhr
          .getResponseHeader('server-timing')
          ?.replace('app;dur=', '')
        )?.toFixed(2)
        if (serverTiming > that.slowAPIThreshold) {
          that.addSlowApiLog(context, [...args], duration)
        }
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

  addSlowApiLog (context, args, duration) {
    const line = {
      etype: 'SLOW_API_LOG',
      networkError: false,
      status: context.statusText,
      statusCode: context.status,
      duration,
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
