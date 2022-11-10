
import axios from 'axios'
import { getAxiosConfig } from '../util/util'

export default class Storage {
  constructor(appname, appid, {
    sessionId,
    env,
    appVersion,
    maraVersion
  }) {
    if (Storage.instance) {
      return Storage.instance
    } else {
      this.__pool__ = []
      this.appname = appname
      this.appid = appid
      this.sessionId = sessionId
      this.env = env
      this.version = maraVersion
      this.appVersion = appVersion
      this.userid = null
      this.cop = false
      this.#startPolling()
      Storage.instance = this
    }
  }

  #startPolling () {
    setInterval(this.#send2Server.bind(this), 1000)
  }
 
  #readLines () {
    let tempLines = []
    if (this.__pool__.length > 30) {
      for(let time = 0; time < 30; time++) {
        tempLines.push(this.__pool__.shift())
      }
    } else {
      tempLines = this.__pool__
      this.__pool__ = []
    }
    return tempLines
  }

  #setCOP () {
    this.cop = true
    setTimeout(() => {
      this.cop = false
    }, 10000)
  }

  #send2Server () {
    if (!this.userid || this.cop) return
    const lines = this.#readLines()
    if (lines.length) {
      const path = 'api/mara/report'
      const data = lines.map(line => {
        line.user = this.userid
        return line
      })
      const config = getAxiosConfig(this.env, 'post', path, data, {
        appname: this.appname,
        appid: this.appid
      })
      axios(config).catch(err => {
        this.__pool__ = lines.concat(this.__pool__)
        this.#setCOP()
      })
    }
  }

  #getLogTemplate () {
    let localeTime
    try {
      localeTime = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})
    } catch (err) {
      localeTime = new Date().toLocaleString()
    }
    const template = Object.assign({}, {
      localeTime: localeTime,
      '@timestamp': Date.now(),
      ua: navigator.userAgent,
      url: location ? location.href : '',
      appname: this.appname,
      sessionId: this.sessionId,
      version: this.version,
      appVersion: this.appVersion
    })
    return template
  }

  setUser (userid) {
    this.userid = userid
  }

  addLine (value) {
    setTimeout(() => {
      this.__pool__.push(Object.assign(this.#getLogTemplate(), value))
    }, 0)
  }
}

Storage.instance = null

export const readLines = () => {}