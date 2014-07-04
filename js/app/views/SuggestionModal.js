define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/suggestion_modal',
    'bt3wysihtml5'
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade suggestion_modal',
        ui:{
            editor : '.content .input'
        },
        events: {
            'submit .frmSuggestion' : "onPostSuggestion"
        },

        templateData: {
            title: 'Suggestion Box'
        },

        onRender: function(){
            ModalBase.prototype.onRender.apply(this, arguments);

            this.bindUIElements();
            this.ui.editor.wysihtml5({
                 fa: true,
                size: 'sm',
                image: false,
                link: false
            });
        },

        onPostSuggestion: function(e){
            //ModalHelper.get('suggestion').execute('post', )
        }
    });
});