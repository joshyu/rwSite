define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/trainingitem',
], function(Marionette, app, ModalBase,  template) {
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
        
        templateData: {
            contentClass : 'campus-item'
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        },

        handleData: function(data){
            var joinLinkTitle = data.campus_training.joinLinkTitle;
            var that = this;
            $.when(app.modelHelper.get('campus_training').requestJoinNum(joinLinkTitle)).done(function(num){
                 that.$('.modal-dialog .numjoined').html(num).addClass('label-primary');
            });

            if(app.preloaded.user.trainingDoneList[data.campus_training.id]){
                data.campus_training.done = true;
            }else if( app.preloaded.user.trainingDataIds[data.campus_training.id]){
                data.campus_training.joined = true;
            }

            if( new Date(data.campus_training.pubdate) < new Date()){
                data.campus_training.outdated = true;
            }

            data.curUserId = app.preloaded.user.info.related.nameRecordId;
            return ModalBase.prototype.handleData.apply(this, arguments);
        }
    });
});