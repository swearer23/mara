import Mara from '../src/index.js'

test('error mara initialization', () => {
  expect(() => {
    new Mara({
      feID: ''
    })
  }).toThrow('feID必传')
})

test('mara initialization', () => {
  new Mara({
    feID: 'lafengH5',
    appid: '945c1315b608be26bb32d15db8f6c806',
    // maxLine: 2,
    logAjaxTrace: true,
    operationMethod: 'download',
    containerFontSize: '14px',
    env: 'uat'
    // excludeAjaxKeywords: ['julianos']
    // customPanelTrigger: true
  })
})

test('mara probe', () => {
  jest.useFakeTimers()
  const mara = new Mara({
    feID: 'lafengH5',
    appid: '945c1315b608be26bb32d15db8f6c806',
  })

  mara.probe('winerr')
  jest.advanceTimersByTime(0)
  expect(mara.forms.storage.__pool__.length).toBe(1)
})

test('mara toggle panel', () => {
  const mara = new Mara({
    feID: 'lafengH5',
    appid: '945c1315b608be26bb32d15db8f6c806',
  })
  jest.spyOn(mara.panel, 'toggleShow');
  mara.showPanel()
  expect(mara.panel.toggleShow).toHaveBeenCalled()
})
