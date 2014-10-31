define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/newhiresitem',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade newhiresitem campus_modal',
        footer: '',
        templateData: {
            contentClass : 'campus-item',
            'modal-class' : 'modal-lg'
        },

        getTemplateData: function(){
           return _.extend(this.templateData, this.options.data);
        }
    });
});