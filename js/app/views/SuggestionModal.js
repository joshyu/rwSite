define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/suggestion_modal',
    'bt3wysihtml5'
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade suggestion_modal',
        events: {
            'submit .frmSuggestion' : "onPostSuggestion"
        },

        templateData: {
            title: 'Suggestion Box'
        },

        onRender: function(){
            ModalBase.prototype.onRender.apply(this, arguments);

            this.$('.content .input').wysihtml5({
                 fa: true,
                size: 'sm',
                image: false,
                link: false
            });
        },

        validateForm: function(){
            var elems= this.$('.frmSuggestion ').find('input, textarea').filter(function(id, elem){
                return $.trim(elem.value).length === 0;
            });

            return elems.length === 0;
        },

        onPostSuggestion: function(e){
            e.preventDefault();
            if(! this.validateForm()){
                this.showErrorMsg('Some Fields not provided');
                return false;
            }

            var $butSubmit = this.$('.btnsubmit');
            $butSubmit.button('loading');
            var frm= e.target;
            var data = {formData: this.$(frm).serialize() };
            var that = this;
            app.modelHelper.get('suggestion').execute('suggestion:post',{data: data, success: function(status){
                 that.showSuccessMsg('Post Message Successfully.');
                 $butSubmit.button('reset');
                 frm.reset();
            }});

            return false;
        }
    });
});