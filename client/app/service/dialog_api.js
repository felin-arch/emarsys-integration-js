'use strict';

var IntegrationApi = require('./integration_api');
var ConfirmComponent = require('./components/confirm');
var ModalComponent = require('./components/modal');

class DialogApi extends IntegrationApi {

  constructor(window) {
    super(window);

    this.deferreds = {};
    this.confirmParams = {};
  }

  submit(success, data = {}) {
    var message = this.generateMessage(success, data);

    if (this.deferreds[this.params.dialogId]) {
      if (success) {
        this.deferreds[this.params.dialogId].resolve(message);
      } else {
        this.deferreds[this.params.dialogId].reject(message);
      }
    } else {
      this.window.SUITE.integration.messageToService(message, this.params.openerIntegrationInstanceId);
    }
  }

  generateMessage(success, data = {}) {
    var message = this.window.$.extend({
      event: 'dialog:submit',
      dialogId: this.params.dialogId,
      success: success
    }, data);

    if (this.confirmParams[this.params.dialogId]) {
      message = this.window.$.extend(message, this.confirmParams[this.params.dialogId]);
    }

    return message;
  }

  resize() {
    this.window.SUITE.integration.messageToSuite({
      event: 'resize',
      height: this.window.document.getElementsByClassName('modal-container')[0].scrollHeight
    });
  }

  confirm(options) {
    if (options.params) {
      this.confirmParams[options.dialogId] = options.params;
    }

    new ConfirmComponent(this.window).render(options);

    if (options.source.integration_id === 'SUITE') {
      this.deferreds[options.dialogId] = this.window.$.Deferred();
      return this.deferreds[options.dialogId].promise();
    }
  }

  modal(options) {
    new ModalComponent(this.window).render(options);
  }

  close() {
    this.window.SUITE.integration.messageToSuite({
      event: 'modal:close'
    });
  }

  static create(global) {
    return new DialogApi(global);
  }

}

module.exports = DialogApi;
