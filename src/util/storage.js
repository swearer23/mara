
class Storage {

  constructor() {
    if (Storage.instance) {
      return Storage.instance
    } else {
      this.__pool__ = {}
      Storage.instance = this
    }
  }

  setItem(key, value) {
    this.__pool__[key] = value;
  }

  getItem(key) {
    return this.__pool__[key]
  }

  remove(keyName) {
    this.__pool__[keyName] = null
  }
}

Storage.instance = null

const storage = new Storage();
const debug = process.env.DEBUG

const write = (keyName, keyValue) => {
  try {
    storage.setItem(keyName, keyValue);
    if (debug) localStorage.setItem(keyName, keyValue)
  } catch (e) {console.error(e)}
};

const read = (keyName) => {
  if (storage.getItem) return storage.getItem(keyName);
  return null;
};

const remove = (keyName) => {
  try {
    storage && storage.removeItem(keyName);
  } catch (e) {}
};

export {
  write,
  read,
  remove
};
