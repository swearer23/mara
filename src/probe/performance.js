export default class PerformanceProbe {
  constructor(storage) {
    this.storage = storage;
    this.collectInterval = null
    this.lastIndex = null
    this.navigationPerfCollected = false
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

  #probe () {
    this.collectInterval = setInterval(() => {
      this.#collect()
    }, 1000)
  }

  #collect () {
    const entries = performance.getEntries()
    if (!this.navigationPerfCollected) {
      this.#collectNavigation(entries.filter(entry => entry.entryType === 'navigation')[0])
      this.lastIndex = 0
    }
    entries.slice(this.lastIndex + 1).forEach(entry => {
      if (entry.name.includes('api/mara/report')) return
      if (entry.entryType === 'resource') {
        console.log(entry.initiatorType)
        const start = Math.max(entry.startTime, entry.fetchStart).toFixed(2)
        const end = entry.responseEnd.toFixed(2)
        this.#addLine({
          entryType: entry.entryType,
          name: entry.name,
          startTime: start,
          endTime: end,
          duration: (end - start).toFixed(2)
        })
      }
    })
    this.lastIndex = entries.length - 1
  }
  #collectNavigation (navigationEntry) {
    this.navigationPerfCollected = true
    const collectDNSPerf = navigationPerf => {
      return {
        entryType: navigationEntry.entryType,
        name: '1.1.dnsLookup',
        startTime: navigationPerf.domainLookupStart.toFixed(2),
        endTime: navigationPerf.domainLookupEnd.toFixed(2),
        duration: (navigationPerf.domainLookupEnd - navigationPerf.domainLookupStart).toFixed(2)
      }
    }
    const collectConnectPerf = navigationPerf => {
      return {
        entryType: navigationEntry.entryType,
        name: '1.2.tcpConnect',
        startTime: navigationPerf.connectStart.toFixed(2),
        endTime: navigationPerf.connectEnd.toFixed(2),
        duration: (navigationPerf.connectStart - navigationPerf.connectEnd).toFixed(2)
      }
    }
    const collectHTMLRequestPerf = navigationPerf => {
      return {
        entryType: navigationEntry.entryType,
        name: '1.3.requestForHTML',
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
        name: '1.4.documentLoad',
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
        name: '1.5.domComplete',
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
        name: '1.navigationTiming',
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

  #addLine ({
    entryType,
    name,
    startTime,
    endTime,
    duration
  }) {
    const line = {
      etype: 'PERF_LOG',
      entryType,
      name,
      startTime,
      endTime,
      duration
    }
    this.storage.addLine(line)
  }
}