define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/traininglist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items row',

        getTemplateData: function(){
            var opts = {
               campus_training : app.preloaded.user.trainingData
            };

            if(this.options.pageId == 'profile'){
                opts.noJoinLink = true;
            }

            opts.curUser = app.preloaded.user.info.name;
            return opts;  
        },

        onRender: function(){
            this.$el.find('.trcode-link').popover();
        }
    });
});