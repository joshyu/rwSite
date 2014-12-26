define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/srclist',
    'bootbox'
], function(Marionette, app, ViewBase,  template, bootbox) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items row',
        pageNo: 0,

        events: {
            'click .btn-cancel' : 'cancel'
        },

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
                };

                this._templateData = this.templateData;
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
            var userownedData = app.preloaded.user.srcData;
            var d= new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            d = new Date(year + '/'+ month +'/' + day);

            _.each(data, function(item){

                if(item.id in userownedIds ){
                    var _item = userownedData[ userownedIds[item.id] ];
                    if(_item && _item.regId){
                        item.joined = true;
                        item.regId = _item.regId;
                    }                    
                }

                item.available = new Date(item.pubdate)  >= d;
            });
        },

        renderData: function (data) {
            if(!this.joinLinkTitles && data){
                this.joinLinkTitles = _.pluck(data.campus_src , 'joinLinkTitle');
                this.markitemStates( data.campus_src  );
            }

            this._renderData(data);
        },

        cancel: function(e){
            e.preventDefault();
            var $dom= $(e.target);
            var itemIndex = $dom.data('index');
            var item = this._templateData && this._templateData['campus_src'][itemIndex];
            if(!item) return false;

            var regId = item.regId;
            var joinLinkTitle = item.joinLinkTitle;
            if(!regId || !joinLinkTitle) return false;
            var that = this;

             bootbox.confirm("Do you want to cancel current SRC event ?", function (res) {
                if( !res ) return;

                var posted = {
                    id : regId,
                    data: {
                        linkTitle: joinLinkTitle
                    }
                };

                posted.success = function(data){
                     var $bannerContainer= $dom.parents('.banner-right');
                     var $numDom= $bannerContainer.find('.numjoined');
                     var num = parseInt($numDom.text());

                     if(!isNaN(num)){
                        $bannerContainer.fadeOut('slow', function(){
                            $numDom.text(num-1);
                            $dom.parent().replaceWith('<span class="btnJoin label label-primary">Available</span>');
                            $bannerContainer.fadeIn();

                            var itemId = item.id;                            
                            var _itemId = app.preloaded.user.srcDataIds[itemId];
                            delete app.preloaded.user.srcDataIds[itemId];
                            app.preloaded.user.srcData.splice(_itemId,1);
                        });
                     }                     
                }

                posted.error = function(){
                    bootbox.alert('fail to cancel the SRC event.');
                    $dom.show().prev('img').remove();
                }
                
                app.modelHelper.get('campus_src').cancelRegItem(posted);
                $dom.hide().before('<img src="images/loading.gif"/>');
            });            
        }
    });
});