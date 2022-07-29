import Panel from './show/panel';
import WinErr from './probe/winerr';
import AjaxErr from './probe/ajaxerr';
import FetchErr from './probe/fetcherr';
import Forms from './form/forms';
import { readLines } from './util/storage';
// import { randomFillSync } from 'crypto'

// if (!window.crypto) {
//   window.crypto = {
//     getRandomValues(buffer) {
//       return randomFillSync(buffer)
//     }
//   }
// }

/**
 * @param opts.feID: 项目Id， 必传
 * @param opts.report: 函数，自定义上报函数
 */
class Mara {
  constructor(opts = {}) {
    opts.report = opts.report || (() => {console.warn('report needs to be defined')});
    opts.operationMethod = opts.operationMethod || 'download';
    this.inited = false;
    try {
      this.checkParams(opts);
      this.init(opts);
    } catch (err) {
      console.error(err)
    }
  }

  checkParams(opts) {
    const operations = ['download', 'upload']

    if (!opts.feID) {
      throw Error('feID必传');
    }
    if (!operations.includes(opts.operationMethod)) {
      const ERROR_MSG = [
        `mara warning: the operationMethod ${opts.operationMethod} is not supported`,
        `please select from either 'download' or 'upload'`
      ]
      throw Error(ERROR_MSG.join('\n'))
    }
  }

  // 初始化
  init(opts) {
    try {
      this.opts = opts;
      const formObj = new Forms(opts.feID, opts.maxLine);
      this.forms = formObj
      this.panel = new Panel(this);
      this.panel.init(opts);
      (new WinErr(formObj)).probe();
      (new AjaxErr(formObj)).probe(opts.logAjaxTrace, opts.excludeAjaxKeywords);
      (new FetchErr(formObj)).probe();
      this.inited = true;
    } catch (e) {
      console.error(e);
    }
    if (opts.containerFontSize) {
      const style = document.createElement('style')
      style.innerText = `.swal2-popup {font-size: ${opts.containerFontSize}}`
      document.head.appendChild(style)
    }
  }

  // 自定义错误
  probe(...msg) {
    this.forms.addLine({
      etype: 'CUSTOM_LOG',
      msg,
    });
  }

  // 数据上报
  report() {
    const lines = readLines();
    if (!lines.length) return;
    this.opts.report(lines);
  }

  showPanel () {
    this.panel.toggleShow();
  }
}

export default Mara;
