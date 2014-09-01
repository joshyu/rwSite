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

        getTemplateData: function(){
            this.templateData['modal-class'] = this.options.isLarge ? 'modal-lg' : '';
            return _.extend(this.templateData, this.options.data);
        }
    });
});