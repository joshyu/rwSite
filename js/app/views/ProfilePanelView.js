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
             return  {
                user : app.preloaded.user
             };
        },

        onRender: function(){
            /*app.jobHelper.get('syncUserRelatedData').registerChangeTrigger(function(data,prevData){
                return data.srcData.length !== prevData.srcData.length;
            }, function(data){
                debugger;
            }, this);*/
        }
    });
});