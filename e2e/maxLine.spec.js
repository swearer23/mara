// @ts-check
const { test, expect } = require('@playwright/test');

// test.use({
//   headless: false
// })

test('测试最大日志行数参数', async ({ page }) => {
  page.waitForEvent('download')
  await page.goto('http://localhost.longfor.com:8888/demo/demo.html?appid=945c1315b608be26bb32d15db8f6c806&maxLine=2&operationMethod=download');
  await page.click('#btn-error', {
    clickCount: 5
  })
  await page.keyboard.press('Control+6')
  await page.click('.swal2-confirm')
  page.on('download', async event => {
    const file = await event.createReadStream()
    if (file) {
      const content = await file.read()
      console.log(content)
    }
  })
  await page.waitForTimeout(1000)
});
