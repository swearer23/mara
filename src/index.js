import WinErr from './probe/winerr';
import AjaxErr from './probe/ajaxerr';
import FetchErr from './probe/fetcherr';
import performance from './probe/performance';
import Storage from './util/storage';
import { nanoid } from 'nanoid';
import EventTarget from '@ungap/event-target'

// import { randomFillSync } from 'crypto'

// window.crypto = {
//   getRandomValues(buffer) {
//     return randomFillSync(buffer)
//   }
// }
class SlowNetworkMonitor extends EventTarget {
  constructor (threshold, speedDetectMode = Mara.NET_NETWORK_SPEED_MODE) {
    super()
    this.threshold = threshold
    this.speedDetectMode = speedDetectMode
    this.networkSpeedSamples = []
    this.SLOW_NETWORK_DETECTED = 'slow_network_detected';
    this.SLOW_NETWORK_RECOVERED = 'slow_network_recovered';
  }

  setSpeedSample (sample) {
    const { speed: preSpeed } = this.calculateSpeedBySamples()
    if (this.networkSpeedSamples.length > 4) {
      this.networkSpeedSamples.shift()
    }
    const { requestStart, responseStart, responseEnd, serverTiming } = sample.costFactors
    if (this.speedDetectMode === Mara.NET_NETWORK_SPEED_MODE) {
      sample.duration = responseEnd - responseStart
    }
    if (this.speedDetectMode === Mara.GROSS_NETWORK_SPEED_MODE) {
      sample.duration = responseEnd - requestStart - serverTiming
    }
    this.networkSpeedSamples.push(sample)
    const { totalSize, totalDuration, speed } = this.calculateSpeedBySamples()
    if (speed < this.threshold) {
      this.#triggerNetworkSpeedEvent(speed, totalSize, totalDuration, this.SLOW_NETWORK_DETECTED)
    } else if (preSpeed < this.threshold) {
      this.#triggerNetworkSpeedEvent(speed, totalSize, totalDuration, this.SLOW_NETWORK_RECOVERED)
    }
  }

  calculateSpeedBySamples () {
    const { totalSize, totalDuration } = this.networkSpeedSamples.reduce((acc, cur) => {
      return {
        totalSize: acc.totalSize + cur.size,
        totalDuration: acc.totalDuration + cur.duration
      }
    }, {totalSize: 0, totalDuration: 0})
    const speed = (totalSize / 1024) / (totalDuration / 1000)
    return { totalSize, totalDuration, speed }
  }

  #triggerNetworkSpeedEvent(speed, totalSize, totalDuration, eventType) {
    const detail = {
      speed,
      speedText: `${speed} kB/s`,
      totalSize,
      totalDuration,
    }
    const event = new CustomEvent(eventType, {detail});
    this.dispatchEvent(event)
    window.performance?.mark(eventType, {detail})
  }
}

class AccumulatedNetworkCostMonitor extends EventTarget {
  constructor (threshold) {
    super()
    this.threshold = threshold
    this.ntPerfPages = null
    this.didReport = false
    this.ACCUMULATED_NETWORK_COST_DETECTED = 'accumulated_network_cost_detected';
  }

  onNetworkCost (perf) {
    const { requestStart, responseEnd, fetchStart } = perf
    const startTime = Math.max(requestStart, fetchStart)
    if (!startTime || !responseEnd || this.didReport) return
    const duration = perf.entryType === 'navigation' ? perf.responseEnd - perf.requestStart : perf.duration 
    if (!this.ntPerfPages) {
      this.ntPerfPages = {
        start: startTime,
        end: responseEnd,
        duration
      }
    } else {
      if (startTime > this.ntPerfPages.end) {
        this.ntPerfPages.start = startTime
        this.ntPerfPages.end = responseEnd
        this.ntPerfPages.duration += duration
      } else {
        if (this.ntPerfPages.end < responseEnd) {
          this.ntPerfPages.duration += responseEnd - this.ntPerfPages.end
          this.ntPerfPages.end = responseEnd
        }
      }
    }
    if (this.ntPerfPages.duration > this.threshold) {
      const detail = {
        networkCost: this.ntPerfPages.duration,
        totalCost: window.performance?.now()
      }
      const event = new CustomEvent(this.ACCUMULATED_NETWORK_COST_DETECTED, {detail})
      this.dispatchEvent(event)
      window.performance?.mark(this.ACCUMULATED_NETWORK_COST_DETECTED, {detail})
      this.didReport = true
    }
  }
}

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
  monitorSlowNetworkAt () {
    return new EventTarget()
  }
  monitorAccumulatedNetworkCost () {
    return new EventTarget()
  }
  setUser () {}
  probe () {}
}

const needFakeInit = () => {
  if (window.__POWERED_BY_QIANKUN__) return true
  if (!window.performance) return true
  if (!window.performance.now) return true
  return false
}

class Mara {
  constructor(appname, appid, {
    env,
    autoTraceId = false,
    traceIdKey = 'x-mara-trace-id',
    sessionIdKey = 'x-mara-session-id',
    excludeAjaxURL = []
  }) {
    if (needFakeInit()) {
      return new FakeMara()
    }
    const globalInstance = globalInstanceGet()
    if (globalInstance) return globalInstance
    
    this.version = 'process.env.mara_version'
    this.#checkParams(appname, appid, env)
    this.appname = appname
    this.appid = appid
    this.env = env
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
    this.storage = new Storage(this.appname, this.appid, this.sessionId, this.env, this.version)
    this.performance = new performance(this.storage, this.env)
    new WinErr(this.storage)
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

  monitorSlowNetworkAt (threshold, speedDetectMode) {
    if (threshold) {
      const slowNetworkMonitor = new SlowNetworkMonitor(threshold, speedDetectMode)
      this.performance.setSlowNetworkNotifier(slowNetworkMonitor)
      return slowNetworkMonitor
    }
  }

  monitorAccumulatedNetworkCost (threshold) {
    if (threshold) {
      const accumulatedNetworkCostMonitor = new AccumulatedNetworkCostMonitor(threshold)
      this.performance.setAccumulatedNetworkCostMonitor(accumulatedNetworkCostMonitor)
      return accumulatedNetworkCostMonitor
    }
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
