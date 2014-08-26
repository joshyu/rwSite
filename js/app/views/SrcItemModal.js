define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/srcitem',
], function(Marionette, app, ModalBase,  template) {
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

            if( app.preloaded.user.srcDataIds[data.campus_src.id]){
                data.campus_src.joined = true;
            }

            return ModalBase.prototype.handleData.apply(this, arguments);
        }
    });
});