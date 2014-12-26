define([
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'marionette',
    'hbs!templates/layouts/header'
], function(app, ViewBase, ModalHelper, Marionette, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
         events: {
            'click .opener': 'openSuggestionBox'
        },
        className:"brand",
        getTemplateData: function(){
             return  {
                user : app.preloaded.user.info,
/*                sitestats: app.preloaded.siteStats
*/             };
        },

        /*bindEvents: function(){
            var that = this;
            app.vent.on('app:sitestats:updated', function(data){
                if(!data) return false;
                
                var $sitems = that.$('.site-stats-items .s-item');
                $sitems.eq(0).html(data.week);
                $sitems.eq(1).html(data.month);
                $sitems.eq(2).html(data.whole);
            });
        },

        onRender: function(){
            this.$('.site-stats-items .s-item').tooltip();
        },*/

        openSuggestionBox: function(e){
            ModalHelper.get('suggestion').show();
            return false;
        }
    });
});