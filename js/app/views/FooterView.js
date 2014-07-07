define([
    'marionette',
    'hbs!templates/layouts/footer'
], function(Marionette, template) {
    'use strict';
    return Marionette.ItemView.extend({
        template: template,
        className:'container'
    });
});