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