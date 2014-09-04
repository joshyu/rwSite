define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/srcitem',
    'bootbox'
], function(Marionette, app, ModalBase,  template, bootbox) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade srcitem campus_modal',
        footer: '',
        request: {
            model: 'campus_src',
            key: 'campus:src:item:info',
            getOptions: 'getRequestOption',
            dataHandler: 'handleItemEventImage'
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
            var job = app.jobHelper.get('requestJoinNum', 'modal');
            var dom = this.$('.modal-dialog .numjoined')[0];
            var _joinLinkTitle = this.joinLinkTitle;

            job.register({
                dom: dom,
                title : _joinLinkTitle,
                modelId : "campus_src"
            });

            job.trigger();
            ModalBase.prototype.onRender.apply(this, arguments);
        },

        handleData: function(data){
            if(!data ) return false;
            this.joinLinkTitle = data.campus_src.joinLinkTitle;
            var userownedIds = app.preloaded.user.srcDataIds;
            var userownedData = app.preloaded.user.srcData;

            if( data.campus_src.id in userownedIds ){
                var _item = userownedData[ userownedIds[data.campus_src.id] ];
                data.campus_src.regId = _item.regId;
                data.campus_src.joined = true;
            }

            if( new Date(data.campus_src.pubdate) < new Date()){
                data.campus_src.outdated = true;
            }

            return ModalBase.prototype.handleData.apply(this, arguments);
        },

        cancel: function(e){
            e.preventDefault();
            var $dom= $(e.target);
            var item = this._templateData.campus_src;
            if(!item) return false;
            
            var regId = item.regId;
            var itemId = item.id;
            var joinLinkTitle = item.joinLinkTitle;
            if(!regId || !joinLinkTitle) return false;
            var that = this;

             bootbox.confirm("Do you want to cancel current SRC event?", function (res) {
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

                            var _itemId = app.preloaded.user.srcDataIds[itemId];
                            delete app.preloaded.user.srcDataIds[itemId];
                            app.preloaded.user.srcData.splice(_itemId,1);
                        });
                     }
                }

                posted.error = function(){
                    that.showErrorMsg('fail to cancel the SRC event.');
                }
                
                app.modelHelper.get('campus_src').cancelRegItem(posted);
            });            
        }
    });
});