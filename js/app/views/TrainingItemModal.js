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
        }
    });
});