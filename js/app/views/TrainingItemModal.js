define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/trainingitem',
    'bootbox'
], function(Marionette, app, ModalBase,  template, bootbox) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade srcitem campus_modal',
        footer: '',
        request: {
            model: 'campus_training',
            key: 'campus:training:item:info',
            getOptions: 'getRequestOption'
        },

        events: {
            'click .btn-cancel' : 'cancel'
        },
        
        templateData: {
            contentClass : 'campus-item'
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        },

        onRender: function(){
            var job = app.jobHelper.get('requestJoinNum','modal');
            var dom = this.$('.modal-dialog .numjoined')[0];
            var _joinLinkTitle = this.joinLinkTitle;

            job.register({
                dom: dom,
                title : _joinLinkTitle,
                modelId : "campus_training"
            });

            job.trigger();
            ModalBase.prototype.onRender.apply(this, arguments);
        },

        handleData: function(data){
            var userownedIds = app.preloaded.user.trainingDataIds;
            var userownedData = app.preloaded.user.trainingData;

            this.joinLinkTitle = data.campus_training.joinLinkTitle;

            if( data.campus_training.id in userownedIds ){
                var _item = userownedData[ userownedIds[data.campus_training.id] ];
                data.campus_training.regId = _item.regId;
                data.campus_training.joined = true;
            }

            var d= new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            d = new Date(year + '/'+ month +'/' + day);

            if( new Date(data.campus_training.pubdate) < d){
                data.campus_training.outdated = true;
            }

            data.curUserId = app.preloaded.user.info.related.nameRecordId;
            return ModalBase.prototype.handleData.apply(this, arguments);
        },

        cancel: function(e){
            e.preventDefault();
            var $dom= $(e.target);
            var item = this._templateData.campus_training;
            if(!item) return false;
            
            var regId = item.regId;
            var itemId = item.id;
            var joinLinkTitle = item.joinLinkTitle;
            if(!regId || !joinLinkTitle) return false;
            var that = this;
            var $domTrigger = $(this.options.domTrigger);

             bootbox.confirm("Do you want to unregister current training session?", function (res) {
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

                            var _itemId = app.preloaded.user.trainingDataIds[itemId];
                            delete app.preloaded.user.trainingDataIds[itemId];
                            app.preloaded.user.trainingData.splice(_itemId,1);
                        });
                     }

                     $domTrigger.trigger('training:unregistered');
                }

                posted.error = function(){
                    that.showErrorMsg('fail to cancel the training session.');
                    $dom.show().prev('img').remove();
                }
                
                app.modelHelper.get('campus_training').cancelRegItem(posted);
                $dom.hide().before('<img src="images/loading.gif"/>');
            });            
        }
    });
});