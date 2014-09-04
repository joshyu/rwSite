define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/home/profile',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className: 'panel-body',

        getTemplateData: function(){
             var _data =   {
                user : app.preloaded.user
             };

             return _data;
        },

        onRender: function(){
            var $node = this.$('.count.loading');
            $.when(app.modelHelper.get('user').getUserInCompletedTask()).then(function(data){
                var incompletedNum = data.src.length + data.training.length;
                $node.html(incompletedNum).removeClass('loading').addClass('badge bg-color-red');
            });

            /*app.jobHelper.get('syncUserRelatedData').registerChangeTrigger(function(data,prevData){
                return data.srcData.length !== prevData.srcData.length;
            }, function(data){
                debugger;
            }, this);*/
        }
    });
});