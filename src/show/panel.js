import ShowPage from './showpage';
import Hammer from 'hammerjs';

function Panel(csi) {
  this.csi = csi;
}

Panel.prototype = {
  init(customPanelTrigger=false) {
    this.showPage = new ShowPage(this.csi.report.bind(this.csi));

    if (customPanelTrigger) return
    this.bindDefaultTrigger()
  },
};

Panel.prototype.bindDefaultTrigger = function () {
  var manager = new Hammer.Manager(document.querySelector('html')); 
  var quadrupletap = new Hammer.Tap({
    event: 'quadrupletap',
    taps: 4
  });

  manager.add(quadrupletap);

  // Subscribe to desired event
  manager.on('quadrupletap', () => {
    this.showPage.toggleShow();
  });

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
