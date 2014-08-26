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

                this.joinLinkTitles =  _.pluck(srcList , 'joinLinkTitle');
            }

            ViewBase.prototype.initialize.apply(this, arguments);
        },

        bindDomEvents: function(modelName, model){
            if(modelName == 'campus_src'){
                model.on('noNextUrl', function(){
                    if(this.containerLayer){
                        this.containerLayer.trigger('removeSeeMoreButton'); 
                    } 
                },this);
            }
        },

        handleEventImage: function(srcList){
            var srcCates = app.preloaded.srcCategoryNames;
            if(!srcList || !srcCates) return false;

            _.each(srcList, function(item){
                if(!item.imageUrl){
                    item.imageUrl = _.find(srcCates , {title: item.category}).imageUrl;
                }
            });
        },

        onRender: function(){
            var that = this;
            var numNodes = this.$('.numjoined');
            if(this.joinLinkTitles){
                var job = app.jobHelper.get('requestJoinNum','pagelist');
                 _.each(this.joinLinkTitles, function(title, i){
                    job.register({
                        dom: numNodes[i],
                        title : title,
                        modelId : "campus_src"
                    });
                });

                job.trigger();
            }
        },

        markitemStates: function(data){
            if(!data) return false;
            var userownedIds = app.preloaded.user.srcDataIds;
            var now = new Date();

            _.each(data, function(item){
                if(item.id in userownedIds ){
                    item.joined = true;
                }

                if( new Date(item.pubdate) < now){
                    item.outdated = true;
                }
            });
        },

        renderData: function (data) {
            if(!this.joinLinkTitles && data){
                this.joinLinkTitles = _.pluck(data.campus_src , 'joinLinkTitle');
                this.markitemStates( data.campus_src  );
            }

            this._renderData(data);
        }
    });
});