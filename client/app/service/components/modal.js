'use strict';

var extend = require('extend');
var Dialog = require('./dialog');

class Modal extends Dialog {

  get modalType() {
    return 'iframe';
  }

  render() {
    super.render();

    var $eModal = $('e-modal');
    $eModal.css('opacity', 0);
    $eModal.find('iframe').load(() => {
      this.window.setTimeout(() => {
        $eModal.css('opacity', 1);
      }, 0);
    });
  }

  getAttributes(options, integrationInstanceId) {
    var attributes = [
      'frameborder="0"',
      'class="integration integration-' + options.source.integration_id + '"',
      'id="integration-' + integrationInstanceId + '"'
    ];

    ['src', 'width', 'height'].forEach((attributeName) => {
      attributes.push(attributeName + '="' + options.data[attributeName] + '"');
    });

    return attributes;
  }

  decorateUrl(options, integrationInstanceId) {
    var glue = options.data.src.indexOf('?') < 0 ? '?' : '&';

    var params = [
      'dialogId=' + options.data.dialogId,
      'integration_id=' + options.source.integration_id,
      'integration_instance_id=' + integrationInstanceId,
      'opener_integration_instance_id=' + options.source.integration_instance_id
    ];

    return options.data.src + glue + params.join('&');
  }

  getModalOptions() {
    var modalOptions = super.getModalOptions();
    if (this.options.data.title) {
      modalOptions.title = this.options.data.title;
    }

    return modalOptions;
  }

  getModalContent(options, integrationInstanceId) {
    options.data = extend({
      width: 650,
      height: 500
    }, options.data);
    options.data.src = this.decorateUrl(options, integrationInstanceId);

    return '<iframe ' + this.getAttributes(options, integrationInstanceId).join(' ') + '></iframe>';
  }

}

module.exports = Modal;
