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

test('mara report test', () => {
  const opts = {
    feID: 'lafengH5',
    appid: '945c1315b608be26bb32d15db8f6c806',
    report: jest.fn() 
  }
  jest.spyOn(opts, 'report')
  const mara = new Mara(opts)
  mara.probe('winerr')
  mara.report()
  expect.extend({
    toHaveOneLine(received, expected) {
      const pass = received.length === 1 && received[0].msg[0] === expected
      if (pass) {
        return {
          message: () => `expected ${received} to have one line with msg ${expected}`,
          pass: true
        }
      } else {
        return {
          message: () => `expected ${received} to have one line with msg ${expected}`,
          pass: false
        }
      }
    }
  })
  expect(opts.report).toHaveBeenCalledWith(expect.toHaveOneLine('winerr'))
})