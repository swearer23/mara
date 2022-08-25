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

class SlowNetworkMonitor extends EventTarget {
  constructor (threshold, speedDetectMode = Mara.NET_NETWORK_SPEED_MODE) {
    super()
    this.threshold = threshold
    this.speedDetectMode = speedDetectMode
    this.networkSpeedSamples = []
  }

  setSpeedSample (sample) {
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
    const { totalSize, totalDuration } = this.networkSpeedSamples.reduce((acc, cur) => {
      return {
        totalSize: acc.totalSize + cur.size,
        totalDuration: acc.totalDuration + cur.duration
      }
    }, {totalSize: 0, totalDuration: 0})
    const speed = (totalSize / 1024) / (totalDuration / 1000)
    if (speed < this.threshold) {
      const event = new CustomEvent('slowNetworkDetected', {detail: {speed, totalSize, totalDuration}});
      this.dispatchEvent(event)
    }
  }
}

class AccumulatedNetworkCostMonitor extends EventTarget {
  constructor (threshold) {
    super()
    this.threshold = threshold
    this.ntPerfPages = null
    this.didReport = false
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
      const event = new CustomEvent('accumulatedNetworkCostDetected', {
        detail: {
          networkCost: this.ntPerfPages.duration,
          totalCost: window.performance?.now()
        }
      })
      this.dispatchEvent(event)
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
class Mara {
  constructor(appname, appid, {
    env = 'uat',
    autoTraceId = false,
    traceIdKey = 'x-mara-trace-id',
    sessionIdKey = 'x-mara-session-id',
    slowAPIThreshold = 0,
    excludeAjaxURL = []
  }) {
    this.checkParams(appname, appid)
    this.appname = appname
    this.appid = appid
    this.env = env
    this.autoTraceId = autoTraceId
    if (this.autoTraceId) {
      this.traceIdKey = traceIdKey
      this.sessionIdKey = sessionIdKey
    }
    this.slowAPIThreshold = slowAPIThreshold
    this.excludeAjaxURL = excludeAjaxURL
    this.userid = null
    this.sessionId = nanoid(16)
    this.init()
  }

  checkParams(appname, appid) {
    if (!appname) {
      throw Error('appname 必传')
    }
    if (!appid) {
      throw Error('appid 必传')
    }
  }

  init() {
    this.storage = new Storage(this.appname, this.appid, this.sessionId, this.env)
    this.performance = new performance(this.storage)
    new WinErr(this.storage)
    new AjaxErr(this.storage, {
      slowAPIThreshold: this.slowAPIThreshold,
      autoTraceId: this.autoTraceId,
      traceIdKey: this.traceIdKey,
      slowAPIThreshold: this.slowAPIThreshold,
      sessionId: this.sessionId,
      sessionIdKey: this.sessionIdKey,
      onApiMeasured: this.performance.addApiMeasureResult.bind(this.performance),
      excludeAjaxURL: this.excludeAjaxURL
    })
    new FetchErr(this.storage)
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

export default Mara;
