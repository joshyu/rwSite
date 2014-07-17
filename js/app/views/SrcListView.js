define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/srclist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items',
        getTemplateData: function(){
            var opts = {
               campus_src : app.preloaded.user.srcData
            };

            if(this.options.pageId == 'profile'){
                opts.noJoinLink = true;
            }           


            return opts;  
        }
    });
});