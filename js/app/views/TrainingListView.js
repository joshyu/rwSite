define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/traininglist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items',
        getTemplateData: function(){
            var opts = {
               campus_training : app.user.trainingData
            };

            if(this.options.pageId == 'profile'){
                opts.noJoinLink = true;
            }           


            return opts;  
        }
    });
});