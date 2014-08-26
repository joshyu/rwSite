define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/home/news',
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
            var that = this;
            
            this.$el.find('.carousel').carousel({interval: 10000});
            app.modelHelper.get('news').fetchListPermissionForCurUser().then(function(link){
                if(link){
                    that.$el.prepend(app.modelHelper.get('roles').getEditLinkHtml(link));
                }
            });            
        }
    });
});