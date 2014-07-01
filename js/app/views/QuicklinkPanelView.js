define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/qlink',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        request: {
            model: 'links',
            key: 'links:quicklinks' 
        },
        templateData: {
            title: 'Quick Links'
        },
    });
});