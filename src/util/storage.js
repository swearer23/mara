
class Storage {
  static instance = null

  constructor() {
    if (!Storage.instance) {
      Storage.instance = {}
    }
  }

  setItem(key, value) {
    Storage.instance[key] = value;
  }

  getItem(key) {
    return Storage.instance[key]
  }

  remove(keyName) {
    Storage.instance[keyName] = null
  }
}

const storage = new Storage();
const debug = process.env.DEBUG

const write = (keyName, keyValue) => {
  try {
    storage.setItem(keyName, keyValue);
    if (debug) localStorage.setItem(keyName, keyValue)
  } catch (e) {}
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
