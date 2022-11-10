import WinErr from './probe/winerr';
import AjaxErr from './probe/ajaxerr';
import FetchErr from './probe/fetcherr';
import performance from './probe/performance';
import Storage from './util/storage';
import { nanoid } from 'nanoid';

// import { randomFillSync } from 'crypto'

// window.crypto = {
//   getRandomValues(buffer) {
//     return randomFillSync(buffer)
//   }
// }

/**
 * @param appid: 项目Id， 必传
 * @param appname: 项目名称，必传
 * @param options: 可选参数
 *    {
 *      env: 'uat | prod'
 *    }
 */

const globalInstanceGet = () => {
  if (window.__mara_id__ && window[window.__mara_id__])
    return window[window.__mara_id__]
  return false
}

const globalInstanceSet = (instanceId, instance, version) => {
  window.__mara_version__ = version
  window.__mara_id__ = instanceId
  window[instanceId] = instance
}

class FakeMara {
  setUser () {}
  probe () {}
}

const needFakeInit = () => {
  if (window.__POWERED_BY_QIANKUN__) return true
  return false
}

class Mara {
  constructor(appname, appid, {
    env,
    autoTraceId = false,
    traceIdKey = 'x-mara-trace-id',
    sessionIdKey = 'x-mara-session-id',
    excludeAjaxURL = [],
    vueVM = null,
    appVersion = null
  }) {
    if (needFakeInit()) {
      console.warn('need fake mara instance')
      return new FakeMara()
    }
    const globalInstance = globalInstanceGet()
    if (globalInstance) return globalInstance
    
    this.version = 'process.env.mara_version'
    this.#checkParams(appname, appid, env)
    this.appname = appname
    this.appid = appid
    this.env = env
    this.vueVM = vueVM
    this.appVersion = appVersion
    this.autoTraceId = autoTraceId
    if (this.autoTraceId) {
      this.traceIdKey = traceIdKey
      this.sessionIdKey = sessionIdKey
    }
    this.excludeAjaxURL = excludeAjaxURL
    this.userid = null
    this.sessionId = nanoid(16)
    globalInstanceSet(this.sessionId, this, this.version)
    this.#init()
  }

  #checkParams(appname, appid, env) {
    if (!appname) {
      throw Error('appname 必传')
    }
    if (!appid) {
      throw Error('appid 必传')
    }
    if (!['uat', 'prod'].includes(env)) {
      throw Error('env 必传，可选值：uat | prod')
    }
  }

  #init() {
    this.storage = new Storage(this.appname, this.appid, {
      sessionId: this.sessionId,
      env: this.env,
      appVersion: this.appVersion,
      maraVersion: this.version
    })
    this.performance = new performance(this.storage, this.env)
    new WinErr(this.storage, this.vueVM)
    new AjaxErr(this.storage, {
      autoTraceId: this.autoTraceId,
      traceIdKey: this.traceIdKey,
      sessionId: this.sessionId,
      sessionIdKey: this.sessionIdKey,
      onApiMeasured: this.performance.addApiMeasureResult.bind(this.performance),
      excludeAjaxURL: this.excludeAjaxURL
    })
    new FetchErr(this.storage)
    setTimeout(() => {
      if (!this.userid)
        this.setUser(Mara.ANONYMOUS_USER)
    }, 5000)
  }

  setUser(userid) {
    this.userid = userid
    this.storage.setUser(userid)
  }

  // 自定义错误
  probe(eventTag, ...message) {
    if (eventTag) {
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2)
      }
      this.storage.addLine({
        etype: 'RT_LOG',
        eventTag,
        message,
      });
    }
  }
}

Mara.NET_NETWORK_SPEED_MODE = 1
Mara.GROSS_NETWORK_SPEED_MODE = 2

Mara.ANONYMOUS_USER = '__mara_anonymous_user__'

export default Mara;
