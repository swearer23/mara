
import axios from 'axios'
import { getAxiosConfig } from '../util/util'

export default class Storage {
  constructor(appname, appid, sessionId) {
    if (Storage.instance) {
      return Storage.instance
    } else {
      this.__pool__ = []
      this.appname = appname
      this.appid = appid
      this.sessionId = sessionId
      this.userid = null
      this.#startPolling()
      Storage.instance = this
    }
  }

  #startPolling () {
    setInterval(this.#send2Server.bind(this), 1000)
  }
 
  #readLines () {
    return this.__pool__
  }

  #send2Server () {
    const lines = this.#readLines()
    if (lines.length && this.userid) {
      const path = 'api/mara/report'
      const config = getAxiosConfig(this.env, 'post', path, lines.map(line => {
        line.user = this.userid
        return line
      }), {
        appname: this.appname,
        appid: this.appid
      })
      axios(config).then(() => {
        this.__pool__ = []
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
      time: Date.now(),
      ua: navigator.userAgent,
      url: location ? location.href : '',
      appname: this.appname,
      sessionId: this.sessionId
    })
    return template
  }

  setUser (userid) {
    if (this.userid) return
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