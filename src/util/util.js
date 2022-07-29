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

export {
  ts2slug,
  sign
};
