define([
    'app',
    'views/ViewBase',
    'marionette',
    'hbs!templates/header'
], function(app, ViewBase, Marionette, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:"brand",
        request: {
            model: 'user',
            key: 'user:info'
        },

        events: {
            
        }
    });
});