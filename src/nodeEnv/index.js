import { nanoid } from 'nanoid';
import { randomFillSync } from 'crypto'
import { getAxiosConfig } from '../util/util';
import axios from 'axios';

globalThis.crypto = {
  getRandomValues(buffer) {
    return randomFillSync(buffer)
  }
}

export default class NodeMara {
  constructor(appname, appid, {
    env,
    appVersion = null
  }) {
    this.env = env
    this.appname = appname
    this.appid = appid
    this.appVersion = appVersion
    this.userid = null
    this.sessionId = nanoid(16)
    this.#init()
  }

  #init() {
    process.on('uncaughtException', errorEvent => {
      const {
        message,
        filename,
        lineno,
        colno,
        error
      } = errorEvent;
      const log = {
        etype: 'JS_ERROR',
        message: `${message} \n ${error && error.stack}`,
        js: `${filename}:${lineno}:${colno}`,
      }
      console.log(log)
      this.#report(log)
    })

    process.on('unhandledRejection', errorEvent => {
      console.log('unhandledRejection', errorEvent)
      const {
        message,
        filename,
        lineno,
        colno,
        error
      } = errorEvent;
    })
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
      appname: this.appname,
      sessionId: this.sessionId,
      version: this.version,
      appVersion: this.appVersion
    })
    return template
  }

  setUser(userid) {
    this.userid = userid
  }

  probe(eventTag, ...message) {
    if (eventTag) {
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2)
      }
      this.#report({
        etype: 'RT_LOG',
        eventTag,
        message,
      })
    }
  }

  #report (log) {
    const path = 'api/mara/report'
    const data = Object.assign({}, this.#getLogTemplate(), log)
    const config = getAxiosConfig(this.env, 'post', path, [data], {
      appname: this.appname,
      appid: this.appid
    })
    config.url = config.url.startsWith('http') ? config.url : `https:${config.url}`
    axios(config).then(res => {console.log(res)}).catch(err => console.error(err))
  }
}