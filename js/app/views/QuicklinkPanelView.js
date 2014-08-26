define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/home/qlink',
], function(Marionette, app, ViewBase, template) {
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
        onRender: function() {
            var that = this;
            app.modelHelper.get('links').fetchListPermissionForCurUser().then(function(link) {
                if (link) {
                    that.$el.prepend(app.modelHelper.get('roles').getEditLinkHtml(link));
                }
            });
        }
    });
});