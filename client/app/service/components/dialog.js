'use strict';

class Dialog {

  constructor(global, options) {
    this.window = global;
    this.options = options;
  }

  render() {
    var $eModal = this.window.$(this.getHtml(this.options, Math.floor(Math.random() * 1000000000)));
    this.window.$('body').append($eModal);
    this.window.riot.mount($eModal[0], this.getModalOptions());
  }

  getModalOptions() {
    var modalOptions = {
      opened: true,
      type: this.modalType,
      width: this.options.data.width
    };

    if (this.options.data.style) {
      modalOptions['data-e-style'] = this.options.data.style;
    }

    return modalOptions;
  }

  getHtml(message, integrationInstanceId) {
    return [
      '<e-modal opened="true">',
      this.getModalContent(message, integrationInstanceId),
      '</e-modal>'
    ].join('\n');
  }

  cleanMessage(text) {
    return this.window.$('<div>' + text + '</div>').text();
  }

}

module.exports = Dialog;
