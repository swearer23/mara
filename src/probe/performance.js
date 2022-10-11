import { tryStringify } from "../util/util";

export default class PerformanceProbe {
  constructor(storage, env) {
    this.storage = storage;
    this.env = env
    this.collectInterval = null
    this.navigationPerfCollected = false
    this.recentFPS = null
    this.enableCollect = false
    if (
      window.performance
      && window.performance.now
      && window.PerformanceObserver
      && window.PerformanceObserver.supportedEntryTypes
      && window.PerformanceEntry) {
      this.#fpsMeter()
      this.enableCollect = true
      if (document.readyState === 'complete') {
        this.#probe()
      } else {
        document.addEventListener('readystatechange', (event) => {
          if (document.readyState === 'complete') {
            this.#probe()
          }
        })
      }
    }
  }

  addApiMeasureResult (xhr, args, traceIdKey) {
    if (!this.enableCollect) return
    const duration = (xhr.completedAt - xhr.xhrOpenedAt).toFixed(2)
    const ttfb = (xhr.startReceiveAt - xhr.xhrOpenedAt).toFixed(2)
    const networkcost = (xhr.completedAt - xhr.startReceiveAt).toFixed(2)
    const traceIdValue = xhr.headers[traceIdKey]
    const serverTiming = xhr.serverTiming
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
    this.#addLine(line)
  }

  #probe () {
    const supportedPOTypes = this.env === 'uat' ? PerformanceObserver.supportedEntryTypes : [
      'navigation',
      'resource',
      'paint',
      'largest-contentful-paint',
      'mark',
      'measure'
    ]
    window.performance.getEntries().forEach(entry => {
      if (supportedPOTypes.includes(entry.entryType))
        this.#collect(entry)
    })
    this.observer = new PerformanceObserver((list, obj) => {
      list.getEntries().forEach(entry => {
        this.#collect(entry)
      })
    });
    this.observer.observe({entryTypes: supportedPOTypes})
  }

  #collect (entry) {
    if (entry.entryType === 'navigation') {
      this.#collectNavigation(entry)
    } else if (!entry.name.includes('api/mara/report')) {
      this.#reportNormalResourcePerf(entry)
    }
  }

  #reportNormalResourcePerf (entry) {
    if (entry.initiatorType === 'xmlhttprequest') return
    if (entry.entryType === 'resource') {
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
        duration: entry.duration.toFixed(2),
        perfDetail: tryStringify(entry.detail)
      })
    } else {
      this.#addLine(entry.toJSON())
    }
  }

  #collectNavigation (navigationEntry) {
    if (this.navigationPerfCollected) return
    if (navigationEntry.domComplete > 0)
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
}
