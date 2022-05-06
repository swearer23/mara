import ShowPage from './showpage';
import Hammer from 'hammerjs';

function Panel(csi) {
  this.csi = csi;
}

Panel.prototype = {
  init() {
    const showPage = new ShowPage(this.csi.report.bind(this.csi));

    var manager = new Hammer.Manager(document.querySelector('html')); 
    var quadrupletap = new Hammer.Tap({
      event: 'quadrupletap',
      taps: 4
    });

    manager.add(quadrupletap);

    // Subscribe to desired event
    manager.on('quadrupletap', function(e) {
      showPage.toggleShow();
    });

    document.addEventListener('keydown', (event) => {
      event = event || window.event;
      if (event.ctrlKey && parseInt(event.key, 10) === 6) {
        showPage.toggleShow();
      }
    });
  },
};

export default Panel;
