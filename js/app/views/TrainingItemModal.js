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

        onRender: function(){
            var job = app.jobHelper.get('requestJoinNum','modal');
            var dom = this.$('.modal-dialog .numjoined')[0];
            var _joinLinkTitle = this.joinLinkTitle;

            job.register(dom, {
                title : _joinLinkTitle,
                modelId : "campus_training"
            });

            job.trigger();
            ModalBase.prototype.onRender.apply(this, arguments);
        },

        handleData: function(data){
            this.joinLinkTitle = data.campus_training.joinLinkTitle;

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