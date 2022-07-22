import { ts2slug, sign } from "../../src/util/util";
import md5 from 'md5'

test("ts2slug test cases", () => {
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  const parseSlug = (slug) => {
    return slug.split('').reverse().map(char => {
      if (isNaN(parseInt(char))) {
        return char.charCodeAt(0)
      } else {
        return char
      }
    }).join("")
  }
  for (let i = 0; i < 1000; i++) {
    const timestamp = randomDate(new Date(2012, 0, 1), new Date()).getTime();
    const slug = ts2slug(timestamp)
    const parsedSlug = parseSlug(slug)
    expect(parsedSlug).toEqual(timestamp.toString())
  }
})

test("sign test case", () => {
  const timestamp = new Date().getTime()
  expect(md5(`appid${timestamp}`)).toEqual(sign('appid', timestamp))
})