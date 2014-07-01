define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/notify_birthday'
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className: 'panel-body',
        templateData: {
            title: 'Birthday'
        },
        
        request: {
            model: 'contacts',
            key: 'contacts:birthday:recently' 
        },

        onRender: function() {
            this.$el.find('.panel-notify-sub-list >a > img').tooltip();
        }
    });
});