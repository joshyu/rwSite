define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/srcitem',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        title: 'src item',
        footer: ''
    });
});