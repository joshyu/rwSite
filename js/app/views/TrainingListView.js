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
            'click .btn-markdone' : 'markdone'
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
            var _trainingDoneList = app.preloaded.user.trainingDoneList;

            _.each(this._templateData , function(item){
                if( item.id in _trainingDoneList ){
                    item.done = true;
                }
            });

            return opts;  
        },

        onRender: function(){
            this.$el.find('.trcode-link').popover();

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

        markdone: function(e){
            e.preventDefault();
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
                            app.preloaded.user.trainingDoneList[itemId] = 1;
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