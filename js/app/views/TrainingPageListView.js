define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/trainingpagelist',
    'views/ModalHelper',
    'bootbox'
], function(Marionette, app, ViewBase,  template, ModalHelper, bootbox) {
    'use strict';
    return ViewBase.extend({
        tagName: "tbody",
        template : template,
        className:'',
        pageNo: 0,
        request: {
            model : 'campus_training',
            key: 'campus:events:training:updates',
            getOptions: 'getRequestOption'
        },

        events:{
            'click  tr' : 'viewTrainingItem',
            'click .btn-cancel' : 'cancel'
        },

        viewTrainingItem: function(e){
            if(e.target.nodeName.toLowerCase() == 'a'){
                return true;
            }

            var domTrigger= e.currentTarget;
            var itemId= Marionette.$(domTrigger).data('item-id');
            e.preventDefault();
            if(itemId){
                ModalHelper.get('training', {itemId: itemId, domTrigger: domTrigger}).show();
            }

            $(domTrigger).on('training:unregistered', _.bind(this.onTrainingItemUnregistered, this));
            return false;
        },

        onTrainingItemUnregistered: function(e){
            var $tr = $(e.target);
            this.revertItemToAvailable( $tr.find('.state-inner') );
        },

         bindDomEvents: function(modelName, model){
            if(modelName == 'campus_training'){
                model.on('noNextUrl', function(){
                    if(this.containerLayer){
                        this.containerLayer.trigger('removeSeeMoreButton'); 
                    } 
                },this);
            }
        },

        getRequestOption: function(){
            this.options.pageNo = this.options.pageNo || this.pageNo;
            return this.options;
        },

        getTemplateData: function(){
            return {
                curUserId: app.preloaded.user.info.related.nameRecordId
            };
        },

        markitemStates: function(data){
            if(!data) return false;
            var userownedIds = app.preloaded.user.trainingDataIds;
            var userownedData = app.preloaded.user.trainingData;
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

                /*if( new Date(item.pubdate) < d){
                    item.outdated = true;
                }*/
            });
        },

        renderData: function (data) {
            if(!this.joinLinkTitles && data){
                this.joinLinkTitles = _.pluck(data.campus_training , 'joinLinkTitle');
                this.markitemStates( data.campus_training  );
            }

            this._renderData(data);
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
                        modelId : "campus_training"
                    });
                });

                job.trigger();
            }
        },

        cancel: function(e){
            e.preventDefault();
            var $dom= $(e.target);
            var itemIndex = $dom.data('index');
            var item = this._templateData && this._templateData['campus_training'][itemIndex];
            if(!item) return false;

            var regId = item.regId;
            var joinLinkTitle = item.joinLinkTitle;
            if(!regId || !joinLinkTitle) return false;
            var that = this;

             bootbox.confirm("Do you want to unregister current training session?", function (res) {
                if( !res ) return;

                var posted = {
                    id : regId,
                    data: {
                        linkTitle: joinLinkTitle
                    }
                };

                posted.success = function(data){
                    that.revertItemToAvailable( $dom.parents('.state-inner') , item);                                         
                }

                posted.error = function(){
                    bootbox.alert('fail to cancel the SRC event.');
                    $dom.show().prev('img').remove();
                }
                
                app.modelHelper.get('campus_src').cancelRegItem(posted);
                $dom.hide().before('<img src="images/loading.gif"/>');
            });            
         },

         revertItemToAvailable: function($bannerContainer, item){
             var $numDom= $bannerContainer.find('.numjoined');
             var num = parseInt($numDom.text());
             var $dom = $bannerContainer.find('.btnJoin');

             if(!isNaN(num)){
                $bannerContainer.fadeOut('slow', function(){
                    $numDom.text(num-1);
                    $dom.replaceWith('<span class="btnJoin label label-primary">Opening</span>');
                    $bannerContainer.fadeIn();

                    if(item){
                        var itemId = item.id;                            
                        var _itemId = app.preloaded.user.trainingDataIds[itemId];
                        delete app.preloaded.user.trainingDataIds[itemId];
                        app.preloaded.user.trainingData.splice(_itemId,1);
                    }                    
                });
             } 
         }
    });
});