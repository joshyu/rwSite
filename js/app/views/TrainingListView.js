define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/traininglist',
    'bootbox'
], function(Marionette, app, ViewBase, template, bootbox) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items row',

        events: {
            'click .btn-markdone' : 'markdone',
            'click .btn-cancel' : 'cancel'
        },

        getTemplateData: function(){
            var opts = {
               campus_training : app.preloaded.user.trainingData
            };

            this._templateData = opts.campus_training;

            if(this.options.pageId == 'profile'){
                opts.noJoinLink = true;
            }

            this.joinLinkTitles =  _.pluck(opts.campus_training, 'joinLinkTitle');
            opts.curUserId = app.preloaded.user.info.related.nameRecordId;

            return opts;  
        },

        onRender: function(){
            var that = this;
            var numNodes = this.$('.numjoined');
            var model = app.modelHelper.get('campus_training');
            if(this.joinLinkTitles){
                _.each(this.joinLinkTitles, function(title, i){
                    $.when(model.requestJoinNum(title)).done(function(num){
                         numNodes.eq(i).html(num).addClass('label-primary');
                    });
                });
            }
        },

        cancel: function(e){
            e.preventDefault();
            var $dom= $(e.target);
            var itemIndex = $dom.data('index');
            var item = this._templateData[itemIndex];
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
                     var $bannerContainer= $dom.parents('.banner-right');
                     var $numDom= $bannerContainer.find('.numjoined');
                     var num = parseInt($numDom.text());

                     if(!isNaN(num)){
                        $bannerContainer.fadeOut('slow', function(){
                            $numDom.text(num-1);
                            $dom.parent().replaceWith('<span class="btnJoin label label-primary">Available</span>');
                            $bannerContainer.fadeIn();

                            var itemId = item.id;                            
                            var _itemId = app.preloaded.user.trainingDataIds[itemId];
                            delete app.preloaded.user.trainingDataIds[itemId];
                            app.preloaded.user.trainingData.splice(_itemId,1);
                        });
                     }                     
                }

                posted.error = function(){
                    bootbox.alert('Fail to unregister the training session.');
                }
                
                app.modelHelper.get('campus_training').cancelRegItem(posted);
            });            
        },
        markdone: function(e){
            e.preventDefault();
            return false;
            //DISABLED.
            var item= e.target;
            var lstId = $(item).data('listid');
            var itemId = $(item).data('item-id');
            var itemData = this._templateData[lstId];
            var nameId = app.preloaded.user.info.related.nameRecordId;
            var that = this;
            var model = app.modelHelper.get('campus_training');
            if(!itemData) return false;

            bootbox.prompt('please input training code:', function  (trcode) {
                if( trcode == null ) return false;

                if(itemData.trainingcode !== trcode){
                    bootbox.alert(" the training code doesn't match. ");
                    return false;
                }

                bootbox.confirm("Training code is correct. Are you sure to mark it done ?", function (res) {
                    if(res){
                        var data= {
                           nameId : nameId,
                           trainingId: itemId
                        };

                        var posted = {data: data};
                        posted.success = function(data){
                            //add to donelist.
                            var $grp = $(item).parents('.btn-group:first');
                            $grp.fadeOut('slow', function(){
                                $grp.replaceWith('<span class="text-muted"> attended </span>');
                            });
                        }

                        model.execute('campus:events:training:markdone', posted);
                    }
                });
            });            
        }
    });
});