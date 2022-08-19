import CryptoJS from 'crypto-js'

const ts2slug = timestamp => {
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

const sign = (appid, timestamp) => {
  return CryptoJS.MD5(`${appid}${timestamp}`).toString();
}

const getAxiosConfig = (env, method, path, data, app) => {
  let host, gaiaKey
  if (env === 'prod') {
    host = 'https://m7-hlgw-c1-openapi.longfor.com/julianos-prod/'
    gaiaKey = 'a2e33eb4-6516-43f9-bcc0-9c47b0f123b3'
  } else {
    host = '//api-uat.longfor.com/julianos-uat/'
    // host = '//localhost:6006/'
    gaiaKey = '791f6690-0714-445f-9273-78a3199622d2'
  }
  const headers = {
    'X-Gaia-Api-Key': gaiaKey
  }
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

export {
  ts2slug,
  sign,
  getAxiosConfig
};
