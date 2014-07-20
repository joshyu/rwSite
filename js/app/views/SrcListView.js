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
            if( _pageId == 'src'){
                var loadnum = this.options.loadnum;
                var pageNo = this.options.pageNo || 0;

                this.request =  {
                    model : 'campus_src',
                    key: 'campus:events:src:updates',
                    options: {
                        num : loadnum,
                        pageNo : pageNo
                    }
                };

            }else if( _pageId == 'profile'){
                this.templateData = {
                    campus_src : app.preloaded.user.srcData,
                    noJoinLink : true
                }
            }

            ViewBase.prototype.initialize.apply(this, arguments);
        },

        loadMore: function (options) {
            if(options.trigger){
                $(options.trigger).addClass('loading');

                var loadnum = this.options.loadnum;
                this.request.options.pageNo = this.pageNo = this.pageNo + 1;
                this.handleRequests();
            }
        }

    });
});