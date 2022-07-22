// @ts-check
const { test, expect } = require('@playwright/test');

test('default config for upload winerr log', async ({ page }) => {
  let reqCount = 0
  await page.goto('http://localhost.longfor.com:8888/demo/demo.html');
  page.on('request', req => {
    reqCount++
    if (reqCount === 1)
      expect(req.url()).toContain('alioss/sts')
    if (reqCount === 2)
      expect(req.url()).toContain('prod-zws-wuguofeng.oss-cn-beijing.aliyuncs.com')
  })
  await page.on('response', async resp => {
    expect(await resp.json()).toMatchObject({Credentials: {}})
  })
  page.waitForResponse(resp => {
    return resp.url().includes('alioss/sts') &&resp.status() === 200
  })
  await page.click('#btn-error', {
    clickCount: 5
  })
  await page.keyboard.press('Control+6')
  await page.click('.swal2-confirm')
  await page.waitForTimeout(1000)
});
