import { readLines } from '../util/store'
import { arrIsNull } from '../util/util'
import { nanoid } from 'nanoid'
import FileSaver from 'file-saver'
import Swal from 'sweetalert2'

function ShowPage(report) {
  this.csiReport = report;
}

// 添加事件侦听
ShowPage.prototype.createPage = function () {
  const logs = readLines()
  if (arrIsNull(logs)) {
    Swal.fire({
      title: '暂无异常',
      text: '稍后窗口会自动关闭',
      icon: 'success',
      timer: 2000
    })
  } else {
    Swal.fire({
      title: '收集完成',
      text: `收集到${logs.length}条日志，点击下方按钮下载日志`,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: '下载',
      showCancelButton: true,
      cancelButtonText: '关闭',
      preConfirm: () => {
        const logs = readLines().map(item => `${JSON.stringify(item, null, 2)}\n`);
        var blob = new Blob(logs, {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${nanoid()}.dat`);
      }
    })
  }
}


// ------------------------------------------------------------------------------
//  切换
// ------------------------------------------------------------------------------

ShowPage.prototype.toggleShow = function () {
  if (!Swal.isVisible())
    this.createPage()
};

export default ShowPage;
