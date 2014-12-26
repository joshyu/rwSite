define([
    'marionette',
    'hbs!templates/layouts/footer'
], function(Marionette, template) {
    'use strict';
    return Marionette.ItemView.extend({
        template: template,
        className:'container',
        onRender: function(){
            var that = this;
            app.vent.on('app:sitestats:updated', function(data){
                if(!data) return false;
                
                var $sitems = that.$('.site-stats-items .s-item');
                $sitems.eq(0).html(data.week);
                $sitems.eq(1).html(data.month);
                $sitems.eq(2).html(data.whole);
            });
            
            this.$('.site-stats-items .s-item').tooltip();
        }
    });
});