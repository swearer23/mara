import { nanoid } from "nanoid";
import { tryStringify } from "../util/util";

const xhrs = {};

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
    traceIdKey,
    sessionId,
    sessionIdKey,
    onApiMeasured,
    excludeAjaxURL
  }) {
    this.storage = storage
    this.autoTraceId = options.autoTraceId
    this.traceIdKey = options.traceIdKey
    this.sessionId = options.sessionId
    this.sessionIdKey = options.sessionIdKey
    this.onApiMeasured = options.onApiMeasured
    options.excludeAjaxURL.push('api/mara/report')
    this.excludeAjaxURLRegex = new RegExp(`(${options.excludeAjaxURL.join('|')})`)
    this.probe()
  }

  getServerTiming (xhr) {
    let serverTiming
    if (xhr.getAllResponseHeaders().indexOf("server-timing") > -1) {
      serverTiming = new Number(xhr
        .getResponseHeader('server-timing')
        ?.replace('app;dur=', '')
      )
      return serverTiming
    } else {
      console.warn(`XHR for ${xhr.responseURL} Response does not provide a valid header server-timing. Try to check if the response headers include Date, or this header is included in Access-Control-Expose-Headers`)
      return 0
    }
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
      const currentXHR = xhrs[xhr.__xhrid]
      if (window.performance && currentXHR) {
        if (xhr.readyState === 2)
          currentXHR.startRequestAt = window.performance.now()
        if (xhr.readyState === 3)
          currentXHR.startReceiveAt = window.performance.now()
        if (xhr.readyState === 4 && xhr.status === 200) {
          currentXHR.completedAt = window.performance.now()
          currentXHR.serverTiming = that.getServerTiming(xhr)
          this.onApiMeasured(Object.assign({}, currentXHR), [...args], this.traceIdKey)
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
