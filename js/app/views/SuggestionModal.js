define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/suggestion_modal',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade suggestion_modal',
        templateData: {
            title: 'Suggestion Box'
        }
    });
});