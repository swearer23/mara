import ShowPage from './showpage';

function Panel(csi) {
  this.csi = csi;
  this.tapQueue = []
}

Panel.prototype = {
  init(customPanelTrigger=false, operationMethod, env) {
    this.showPage = new ShowPage(this.csi.report.bind(this.csi), operationMethod, env);

    if (customPanelTrigger) return
    this.bindDefaultTrigger()
  },
  onTapQueue (e, maxLength) {
    const prevTap = this.tapQueue.length ? this.tapQueue[this.tapQueue.length - 1] : null
    if (prevTap) {
      if (e.timeStamp - prevTap.timeStamp > 300) {
        this.tapQueue = []
      }
    }
    this.tapQueue.push(e)
    if (this.tapQueue.length === maxLength) {
      this.tapQueue = []
      return true
    }
  }
};

Panel.prototype.bindDefaultTrigger = function () {
  document.querySelector('html').addEventListener('touchend', (e) => {
    const isQuadrupleTap = this.onTapQueue(e, 4)
    if (isQuadrupleTap) {
      setTimeout(this.toggleShow.bind(this), 100)
    }
  })

  // Subscribe to desired event

  document.addEventListener('keydown', (event) => {
    event = event || window.event;
    if (event.ctrlKey && parseInt(event.key, 10) === 6) {
      this.showPage.toggleShow();
    }
  });
}

Panel.prototype.toggleShow = function () {
  this.showPage.toggleShow()
}

export default Panel;
