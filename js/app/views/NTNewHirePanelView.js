define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/notify_newhire'
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:'panel-body',
        request: {
            model: 'contacts',
            key: 'contacts:newhire',
            data: {
                title : 'New Hire'
            }
        },

        onRender: function () {
            this.$el.find('.carousel').carousel({interval: 6000});
        }
    });
});