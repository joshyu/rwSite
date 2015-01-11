define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/pmimageitem',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade pmimageitem campus_modal ',
        footer: '',

        templateData: {
            contentClass : 'campus-item '
        },

        getTemplateData: function(){
            this.options.data.title = this.options.data.title || 'No Title';
            return _.extend(this.templateData, this.options.data);
        }
    });
});