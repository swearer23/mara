import Table from './table.js';

const Forms = function (feID, maxLine) {
  this.errTable = new Table(feID, 'err', maxLine);
};
Forms.prototype = {
  addLine(data) {
    // const table = (type === 'err' || type === 'error' || type === 'ERROR') ? this.errTable : this.norTable;
    const table = this.errTable;
    // 防止阻塞
    setTimeout(() => {
      table.addLine(data);
    }, 0);
  },
};

export default Forms;
