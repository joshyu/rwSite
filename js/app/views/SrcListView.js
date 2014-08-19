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
                //options.filters = this.parseFilter(options);

                this.request =  {
                    model : 'campus_src',
                    key: 'campus:events:src:updates',
                    options : options,
                    dataHandler: 'handleEventImage'
                };

            }else if( _pageId == 'profile'){
                this.request = {};
                var srcList = app.preloaded.user.srcData;
                this.handleEventImage(srcList);
                this.templateData = {
                    campus_src : srcList,
                    noJoinLink : true
                }
            }

            ViewBase.prototype.initialize.apply(this, arguments);
        },

        handleEventImage: function(srcList){
            var srcCates = app.preloaded.srcCategoryNames;
            if(!srcList || !srcCates) return false;

            _.each(srcList, function(item){
                if(!item.imageUrl){
                    item.imageUrl = _.find(srcCates , {title: item.category}).imageUrl;
                }
            });
        }
    });
});