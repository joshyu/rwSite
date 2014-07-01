define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/news',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        request: {
            model: 'news',
            key: 'campus:news:list'
        },

        templateData: {
            title: 'Campus News'
        },

        onRender: function () {
            this.$el.find('.carousel').carousel({interval: 10000});
        }
    });
});