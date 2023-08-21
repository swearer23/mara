import MD5 from 'crypto-js/md5'
import { REPORT_HOST, REPORT_PORT } from '../../config';

export const ts2slug = timestamp => {
  const currSegmentsValidChar = seg => (seg >= 65 && seg < 91) || (seg >= 97 && seg < 123)
  const tsStr = timestamp.toString().split("");
  let encryptedTs = ""
  let p = 0
  while(p < 13) {
    const currSeg = tsStr[p]
    const ddCurrSeg = `${currSeg}${tsStr[p+1]}`
    const tdCurrSeg = `${ddCurrSeg}${tsStr[p+2]}`
    if (parseInt(currSeg) === 0) {
      encryptedTs = `${encryptedTs}${currSeg}`
      p++
      continue
    }
    if (currSegmentsValidChar(parseInt(ddCurrSeg))) {
      encryptedTs = encryptedTs + String.fromCharCode(ddCurrSeg)
      p += 2
      continue
    }
    if (currSegmentsValidChar(parseInt(tdCurrSeg))) {
      encryptedTs = encryptedTs + String.fromCharCode(tdCurrSeg)
      p += 3
      continue
    }
    encryptedTs = encryptedTs + currSeg
    p++
  }
  return encryptedTs.split("").reverse().join("")
}

export const sign = (appid, timestamp) => {
  return MD5(`${appid}${timestamp}`).toString();
}

export const getAxiosConfig = (method, path, data, app) => {
  const headers = {}
  const host = `//${REPORT_HOST}:${REPORT_PORT}/`
  const timestamp = new Date().getTime()
  const slug = ts2slug(timestamp)
  const signature = sign(app.appid, timestamp)
  if (app.appid) {
    headers['x-mara-signature'] = signature,
    headers['x-mara-slug'] = slug,
    headers['x-mara-app-name'] = app.appname
  }
  const url = `${host}${path}`
  return {
    method: method,
    url: url,
    withCredentials: true,
    headers: headers,
    data
  }
}

export const tryStringify = obj => {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return 'not_serializable'
  }
}
