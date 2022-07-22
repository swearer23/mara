export default class Storage {

  constructor(feid, maxLine) {
    if (Storage.instance) {
      return Storage.instance
    } else {
      this.__pool__ = []
      this.feid = feid
      this.maxLine = maxLine
      Storage.instance = this
    }
  }

  addLine (value) {
    if (this.__pool__.length >= this.maxLine) {
      this.__pool__.shift()
    }
    this.__pool__.push(Object.assign({feid: this.feid}, value));
  }

  readLines () {
    return this.__pool__
  }
}

Storage.instance = null

export const readLines = () => {
  return Storage.instance.readLines()
}