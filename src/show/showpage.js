import { readLines } from '../util/store'
import { arrIsNull } from '../util/util'
import { nanoid } from 'nanoid'
import FileSaver from 'file-saver'
import Swal from 'sweetalert2'
import axios from 'axios'
import OSS from 'ali-oss'
import Clipboard from 'clipboard'
import Toastify from 'toastify-js'

const operations = {
  'download': '下载',
  'copy': '复制',
  'upload': '上传',
  'report': '上报'
}

function ShowPage(report, operation='download') {
  this.csiReport = report;
  if (operations[operation]) {
    this.operation = operation
    this.mainBtnText = operations[operation]
  }
}

const uploadLogs = async () => {
  const logs = readLines().map(item => `${JSON.stringify(item, null, 2)}\n`);
  var blob = new Blob(logs, {type: "text/plain;charset=utf-8"});
  const filename = `${nanoid()}.dat`
  const stsURL = 'http://localhost.longfor.com:6006/api/admin/alioss/sts'
  const { Credentials } = (await axios({
    method: "get",
    url: stsURL,
    withCredentials: true
  })).data
  const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: Credentials.AccessKeyId,
    accessKeySecret: Credentials.AccessKeySecret,
    stsToken: Credentials.SecurityToken,
    bucket: 'prod-zws-wuguofeng'
  })
  await client.put(`mara/${filename}`, blob)
  const url = await client.signatureUrl(`mara/${filename}`)
  Swal.fire({
    title: '上传完成',
    icon: 'success',
    showConfirmButton: true,
    confirmButtonText: '复制链接',
    showCancelButton: true,
    cancelButtonText: '关闭',
    preConfirm: () => {
      document.querySelector('.swal2-confirm').setAttribute('data-clipboard-text', url)
      const clipboard = new Clipboard('.swal2-confirm')
      clipboard.on('success', function(e) {
        console.log(e)
        Toastify({
          text: "链接已复制",
          duration: 1000,
          gravity: "bottom",
          position: 'center',
          style: {
            position: 'fixed',
            margin: '0 auto',
            left: 0,
            right: 0,
            width: '80px',
            textAlign: 'center',
            background: "black",
            zIndex: "999999",
            padding: '5px',
            opacity: 0.8,
            borderRadius: '5px',
            color: 'white'
          }
        }).showToast();
        e.clearSelection();
      });
    }
  })
}

const copyLogs = () => {
  const logs = JSON.stringify(readLines(), null, 2)
  document.querySelector('.swal2-confirm').setAttribute('data-clipboard-text', logs)
  const clipboard = new Clipboard('.swal2-confirm')
  clipboard.on('success', function(e) {
    Toastify({
      text: "复制成功",
      duration: 1000,
      gravity: "bottom",
      position: 'center',
      style: {
        position: 'fixed',
        margin: '0 auto',
        left: 0,
        right: 0,
        width: '80px',
        textAlign: 'center',
        background: "black",
        zIndex: "999999",
        padding: '5px',
        opacity: 0.8,
        borderRadius: '5px',
        color: 'white'
      }
    }).showToast();
    e.clearSelection();
  });
}

const download = () => {
  const logs = readLines().map(item => `${JSON.stringify(item, null, 2)}\n`);
  var blob = new Blob(logs, {type: "text/plain;charset=utf-8"});
  const filename = `${nanoid()}.dat`
  FileSaver.saveAs(blob, filename);
}

// 添加事件侦听
ShowPage.prototype.createPage = function () {
  const logs = readLines()
  if (arrIsNull(logs)) {
    Swal.fire({
      title: '暂无异常',
      text: '稍后窗口会自动关闭',
      icon: 'success',
      heightAuto: false,
      timer: 2000
    })
  } else {
    Swal.fire({
      title: '收集完成',
      text: `收集到${logs.length}条日志，点击下方按钮下载日志`,
      icon: 'success',
      heightAuto: false,
      showConfirmButton: true,
      confirmButtonText: this.mainBtnText,
      showCancelButton: true,
      cancelButtonText: '关闭',
      preConfirm: () => {
        if (this.operation === 'upload') {
          return uploadLogs()
        } else if (this.operation === 'copy') {
          return copyLogs()
        } else {
          return download()
        }
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
