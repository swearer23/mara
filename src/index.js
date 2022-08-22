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
class Mara {
  constructor(appname, appid, options = {env: 'uat'}) {
    this.checkParams(appname, appid)
    this.appname = appname
    this.appid = appid
    this.env = options.env
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
    this.storage = new Storage(this.appname, this.appid, this.sessionId)
    new WinErr(this.storage)
    new AjaxErr(this.storage)
    new FetchErr(this.storage)
    new performance(this.storage)   
  }

  setUser(userid) {
    this.storage.setUser(userid)
  }

  // 自定义错误
  probe(eventTag, ...message) {
    if (eventTag) {
      if (typeof msg !== 'object') {
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

export default Mara;
