import { tryStringify } from "../util/util";

export default class PerformanceProbe {
  constructor(storage) {
    this.storage = storage;
    this.collectInterval = null
    this.lastIndex = null
    this.navigationPerfCollected = false
    this.recentFPS = null
    this.#fpsMeter()
    if (window.performance) {
      if (window.performance.getEntriesByType('navigation')[0].domComplete) {
        this.#probe()
      } else {
        window.addEventListener('load', () => {
          this.#probe()
        })
      }
    }
  }

  addApiMeasureResult (xhr, args, traceIdKey) {
    if (!window.performance) return
    const duration = (xhr.completedAt - xhr.xhrOpenedAt).toFixed(2)
    const ttfb = (xhr.startReceiveAt - xhr.xhrOpenedAt).toFixed(2)
    const networkcost = (xhr.completedAt - xhr.startReceiveAt).toFixed(2)
    const traceIdValue = xhr.headers[traceIdKey]
    const responseSize = xhr.xhrObject.response.length
    const serverTiming = xhr.serverTiming
    this.#getNetworkSpeed(responseSize, {
      requestStart: xhr.xhrOpenedAt,
      responseStart: xhr.startReceiveAt,
      responseEnd: xhr.completedAt,
      serverTiming
    })
    const line = {
      entryType: 'xmlhttprequest',
      entryName: args[1],
      startTime: xhr.xhrOpenedAt.toFixed(2),
      endTime: xhr.completedAt.toFixed(2),
      duration: duration,
      ttfb,
      networkcost,
      serverTiming,
      traceIdKey,
      traceIdValue
    }
    const { response } = xhr.xhrObject;
    const { payload, headers } = xhr
    const context = {
      payload,
      headers,
      response
    }
    context.payload && (line.payload = tryStringify(context.payload))
    context.response && (line.response= tryStringify(context.response))
    context.headers && (line.headers = tryStringify(context.headers))
    this.#addLine(line)
  }

  setSlowNetworkNotifier (slowNetworkNotifier) {
    this.slowNetworkNotifier = slowNetworkNotifier
  }

  setAccumulatedNetworkCostMonitor (accumulatedNetworkCostMonitor) {
    this.accumulatedNetworkCostMonitor = accumulatedNetworkCostMonitor
  }

  #probe () {
    this.collectInterval = setInterval(() => {
      this.#collect()
    }, 1000)
  }

  #collect () {
    const entries = performance.getEntries()
    if (!this.navigationPerfCollected) {
      const entry = entries.filter(entry => entry.entryType === 'navigation')[0]
      this.#collectNavigation(entry)
      this.lastIndex = 0
      if (this.accumulatedNetworkCostMonitor)
        this.accumulatedNetworkCostMonitor.onNetworkCost(entry)
    }
    entries.slice(this.lastIndex + 1).forEach(entry => {
      if (entry.name.includes('api/mara/report')) return
      this.#reportNormalResourcePerf(entry)
      if (this.accumulatedNetworkCostMonitor)
        this.accumulatedNetworkCostMonitor.onNetworkCost(entry)
    })
    this.lastIndex = entries.length - 1
  }

  #reportNormalResourcePerf (entry) {
    if (entry.entryType === 'resource' && entry.initiatorType !== 'xmlhttprequest') {
      const start = Math.max(entry.startTime, entry.fetchStart).toFixed(2)
      const end = entry.responseEnd.toFixed(2)
      this.#addLine({
        entryType: entry.entryType,
        entryName: entry.name,
        startTime: start,
        endTime: end,
        duration: (end - start).toFixed(2)
      })
    } else if (['mark', 'measure'].includes(entry.entryType)) {
      this.#addLine({
        entryType: entry.entryType,
        entryName: entry.name,
        startTime: entry.startTime.toFixed(2),
        duration: entry.duration.toFixed(2)
      })
    }
  }

  #collectNavigation (navigationEntry) {
    this.navigationPerfCollected = true
    const collectDNSPerf = navigationPerf => {
      return {
        entryType: navigationEntry.entryType,
        entryName: '1.1.dnsLookup',
        startTime: navigationPerf.domainLookupStart.toFixed(2),
        endTime: navigationPerf.domainLookupEnd.toFixed(2),
        duration: (navigationPerf.domainLookupEnd - navigationPerf.domainLookupStart).toFixed(2)
      }
    }
    const collectConnectPerf = navigationPerf => {
      return {
        entryType: navigationEntry.entryType,
        entryName: '1.2.tcpConnect',
        startTime: navigationPerf.connectStart.toFixed(2),
        endTime: navigationPerf.connectEnd.toFixed(2),
        duration: (navigationPerf.connectEnd - navigationPerf.connectStart).toFixed(2)
      }
    }
    const collectHTMLRequestPerf = navigationPerf => {
      return {
        entryType: navigationEntry.entryType,
        entryName: '1.3.requestForHTML',
        startTime: navigationPerf.requestStart.toFixed(2),
        endTime: navigationPerf.responseEnd.toFixed(2),
        duration: (navigationPerf.responseEnd - navigationPerf.requestStart).toFixed(2)
      }
    }
    const collectDocumentLoadPerf = navigationPerf => {
      const start = navigationPerf.responseEnd.toFixed(2)
      const end = navigationPerf.domContentLoadedEventEnd.toFixed(2)
      return {
        entryType: navigationEntry.entryType,
        entryName: '1.4.documentLoad',
        startTime: start,
        endTime: end,
        duration: (end - start).toFixed(2)
      }
    }
    const collectDomCompletePerf = navigationPerf => {
      const start = navigationPerf.domContentLoadedEventEnd.toFixed(2)
      const end = navigationPerf.domComplete.toFixed(2)
      return {
        entryType: navigationEntry.entryType,
        entryName: '1.5.domComplete',
        startTime: start,
        endTime: end,
        duration: (end - start).toFixed(2)
      }
    }
    const collectNavigationTiming = navigationPerf => {
      const start = 0
      const end = navigationPerf.domComplete.toFixed(2)
      return {
        entryType: navigationEntry.entryType,
        entryName: '1.navigationTiming',
        startTime: start,
        endTime: end,
        duration: (end - start).toFixed(2)
      }
    }
    const dnsLookup = collectDNSPerf(navigationEntry)
    this.#addLine(dnsLookup)
    const tcpConnect = collectConnectPerf(navigationEntry)
    this.#addLine(tcpConnect)
    const requestForHTML = collectHTMLRequestPerf(navigationEntry)
    this.#addLine(requestForHTML)
    const loadDocument = collectDocumentLoadPerf(navigationEntry)
    this.#addLine(loadDocument)
    const domComplete = collectDomCompletePerf(navigationEntry)
    this.#addLine(domComplete)
    const navigationTiming = collectNavigationTiming(navigationEntry)
    this.#addLine(navigationTiming)
    const { responseStart, responseEnd } = navigationEntry
    this.#getNetworkSpeed(navigationEntry.transferSize, {
      requestStart: navigationEntry.startTime,
      responseStart,
      responseEnd,
      serverTiming: 0
    })
  }

  #addLine (line) {
    const extraProps = {
      etype: 'PERF_LOG',
      fps: this.recentFPS,
      memoryUsage: {}
    }

    if (window.performance.memory) {
      const {jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize} = window.performance.memory
      extraProps.memoryUsage = {
        jsHeapSizeLimit,
        totalJSHeapSize,
        usedJSHeapSize,
        usedPercentage: (usedJSHeapSize / jsHeapSizeLimit).toFixed(2)
      }
    }

    this.storage.addLine(Object.assign(line, extraProps))
  }

  #fpsMeter() {
    let prevTime = Date.now(),
        that = this,
        frames = 0;
    if (requestAnimationFrame) {
      requestAnimationFrame(function loop() {
        const time = Date.now();
        frames++;
        if (time > prevTime + 200) {
          let fps = Math.round( ( frames * 200 ) / ( time - prevTime ) );
          prevTime = time;
          frames = 0;
          that.recentFPS = fps * 5
        }

        requestAnimationFrame(loop);
      });
    }
  }

  #getNetworkSpeed (size, costFactors) {
    if (!this.slowNetworkNotifier) return
    this.slowNetworkNotifier.setSpeedSample({size, costFactors})
  }
}
