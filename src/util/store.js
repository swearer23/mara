import { obj2Str, str2Obj } from './util';
import { read as storageRead, remove as storageRemove, write as storageWrite } from './storage';

const preName = 'csijs_';

const prefix = (keyName) => {
  if (keyName.indexOf(preName) === 0) return keyName;
  return preName + keyName;
};

const write = (keyName, keyValue, pure) => {
  if (typeof keyValue === 'object') {
    keyValue = pure ? keyValue : obj2Str(keyValue);
  }

  storageWrite(prefix(keyName), keyValue);
};

const read = (keyName, pure) => {
  const val = storageRead(prefix(keyName));
  if (val) {
    if (pure) return val;
    return str2Obj(val);
  }
  return null;
};

const remove = (keyName) => {
  storageRemove(prefix(keyName));
};

const readLines = () => {
  const info = read('info');
  const lines = [];
  const length = info ? info.length : 0;
  if (info && length) {
    const max = parseInt(info.max, 10);
    const min = parseInt(info.min, 10);
    for (let i = min; i <= max; i++) {
      const keyName = `${info.type}_${i}`;
      const line = read(keyName);
      lines.push(line);
    }
  }
  return lines;
};

export {
  write,
  read,
  remove,
  readLines
};
