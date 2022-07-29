// @ts-check
const { test, expect } = require('@playwright/test');


test('使用空cookie调用IDM鉴权方式的OSS上传接口', async ({ page }) => {
  await page.goto('http://localhost.longfor.com:8888/demo/demo.html');
  page.on('request', req => {
    expect(req.url()).toContain('admin/alioss/sts')
  })
  page.on('response', async resp => {
    expect(await resp.json()).toMatchObject({errmsg: 'INVALID_IDM_TOKEN'})
  })
  page.waitForResponse(resp => {
    return resp.url().includes('alioss/sts') &&resp.status() === 400
  })
  await page.click('#btn-error', {
    clickCount: 5
  })
  await page.keyboard.press('Control+6')
  await page.click('.swal2-confirm')
  await page.waitForTimeout(1000)
});

test('使用有效cookie调用IDM鉴权方式的OSS上传接口', async ({ page, browser }) => {
  const context = await browser.newContext();
  context.clearCookies()
  const redirectURL = 'http://localhost.longfor.com:8888/demo/demo.html'
  const ssoURL = `https://sso-uat.longfor.com/cas/new/login?service=${encodeURIComponent(redirectURL)}`
  await page.goto(ssoURL)
  await page.click('.login-card .login-icon')
  await page.click('.login-card .footer span:first-child')
  await page.fill('.login-name .account input', 'yangshiwei')
  await page.fill('.login-pasw .password input', '91r8cuhdjn19gHFH**')
  await page.click('.login-submit')
  await page.waitForNavigation()
  await page.goto(redirectURL)
  let reqCount = 0
  page.on('request', req => {
    if (req.resourceType() === 'xhr') 
      reqCount++
    else
      return
    if (reqCount === 1)
      expect(req.url()).toContain('admin/alioss/sts')
    if (reqCount === 2)
      expect(req.url()).toContain('prod-zws-wuguofeng.oss-cn-beijing.aliyuncs.com')
  })
  page.on('response', async resp => {
    if (reqCount === 1)
      expect(await resp.json()).toMatchObject({Credentials: {}})
  })
  page.waitForResponse(resp => {
    const matches = [
      'alioss/sts',
      'prod-zws-wuguofeng.oss-cn-beijing.aliyuncs.com'
    ]
    let match = false
    matches.forEach(m => {
      if (resp.url().includes(m)) {
        match = true
      }
    })
    return match
  })
  await page.click('#btn-error', {
    clickCount: 5
  })
  await page.keyboard.press('Control+6')
  await page.click('.swal2-confirm')
  await page.waitForTimeout(1000)
})