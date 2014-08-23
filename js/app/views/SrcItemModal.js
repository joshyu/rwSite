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

        handleData: function(data){
            if(!data ) return false;
            var joinLinkTitle = data.campus_src.joinLinkTitle;
            var that = this;
            $.when(app.modelHelper.get('campus_src').requestJoinNum(joinLinkTitle)).done(function(num){
                 that.$('.modal-dialog .numjoined').html(num).addClass('label-primary');
            });

            if( app.preloaded.user.srcDataIds[data.campus_src.id]){
                data.campus_src.joined = true;
            }

            return ModalBase.prototype.handleData.apply(this, arguments);
        }
    });
});