define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/srclist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items row',
        pageNo: 0,

        initialize: function(){
            var _pageId= this.options.pageId;
            this.pageNo = 0;
            this.options.pageNo  = this.options.pageNo || this.pageNo;

            if( _pageId == 'listpage'){
                var options = this.options;
                delete options.pageId;

                this.request =  {
                    model : 'campus_src',
                    key: 'campus:events:src:updates',
                    options : options
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