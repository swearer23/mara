import Storage from '../util/storage.js';
import { nanoid } from 'nanoid';

const Line = {
  pid: '',
  index: '',
  time: '',
  ua: '',
  etype: '',
  msg: '',
  url: '',
  other: ''
};
const Forms = function (feID, maxLine) {
  this.storage = new Storage(feID, maxLine);
};
Forms.prototype = {
  addLine(data) {
    const initLine = {
      pid: nanoid(),
      time: Date.now(),
      ua: navigator.userAgent,
      url: location ? location.href : ''
    };
    // 防止阻塞
    setTimeout(() => {
      this.storage.addLine(Object.assign(initLine, data));
    }, 0);
  },
};

export default Forms;
