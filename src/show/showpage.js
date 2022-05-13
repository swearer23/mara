import { readLines } from '../util/store'
import { arrIsNull } from '../util/util'
import { nanoid } from 'nanoid'
import FileSaver from 'file-saver'
import Swal from 'sweetalert2'

function ShowPage(report) {
  this.appended = false;
  this.csiReport = report;
}

// 添加事件侦听
ShowPage.prototype.createPage = function () {
  Swal.fire({
    title: '正在收集日志'
  }).then(() => {
    this.appended = false
  })
  setTimeout(() => {
    if (this.appended) {
      const logs = readLines()
      if (arrIsNull(logs)) {
        Swal.update({
          title: '暂无异常',
          text: '稍后窗口会自动关闭',
          icon: 'success'
        })
        setTimeout(() => {
          if (this.appended)
            Swal.close()
        }, 2000)
      } else {
        Swal.update({
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
  }, 500)
}


// ------------------------------------------------------------------------------
//  切换
// ------------------------------------------------------------------------------
ShowPage.prototype.appendTo = function () {
  this.createPage();
  this.appended = true;
};

ShowPage.prototype.remove = function () {
  this.appended = false;
  Swal.close()
};

ShowPage.prototype.toggleShow = function () {
  if (!this.appended)
    this.appendTo();
};

export default ShowPage;
