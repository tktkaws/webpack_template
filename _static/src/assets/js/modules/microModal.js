import MicroModal from 'micromodal';
// var MicroModal = require('micromodal');

MicroModal.init({
  onShow: (modal) => console.info('${modal.id} is shown'),
  onClose: (modal) => console.info('${modal.id} is hidden'),
  openTrigger: 'data-custom-open',
  closeTrigger: 'data-custom-close',
  openClass: 'is-open',
  disableScroll: false,
  disableFocus: false,
  awaitOpenAnimation: true,
  awaitCloseAnimation: true,
  debugMode: true,
});
