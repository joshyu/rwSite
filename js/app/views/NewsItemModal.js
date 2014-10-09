define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/newsitem',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade newsitem campus_modal',
        footer: '',
        templateData: {
            contentClass : 'campus-item',
            'modal-class' : 'modal-lg'
        },
        request: {
            model: 'news',
            key: 'campus:news:item',
            getOptions: 'getRequestOption'
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        }
    });
});