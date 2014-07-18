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
/*        getTemplateData: function(){
            var opts = {
               campus_src : app.preloaded.user.srcData
            };

            if(this.options.pageId == 'profile'){
                opts.noJoinLink = true;
            } 
            return opts;  
        },*/

        initialize: function(){
            var _pageId= this.options.pageId;
            if( _pageId == 'src'){
                this.request =  {
                    model : 'campus_src',
                    key: 'campus:events:src:updates',
                    options: {
                        num : 10
                    }
                };
            }else if( _pageId == 'profile'){
                this.templateData = {
                    campus_src : app.preloaded.user.srcData,
                    noJoinLink : true
                }
            }

            ViewBase.prototype.initialize.apply(this, arguments);
        }

    });
});