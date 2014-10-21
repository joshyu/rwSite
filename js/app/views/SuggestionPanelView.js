define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/suggestion',
], function(Marionette, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template
    });
});