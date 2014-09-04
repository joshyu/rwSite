define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/suggestion_modal',
    'bt3wysihtml5'
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    //update this for production use.
    var MailList = {
        'campus_manager' : 'hhong@ra.rockwell.com', //ksong@ra.rockwell.com
        'hr': 'hhong@ra.rockwell.com' //jjwang2@rockwellautomation.com
    }
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
            alert('send message is disabled during development.');
            return false;
            
            if(! this.validateForm()){
                this.showErrorMsg('Some Fields not provided');
                return false;
            }

            var $butSubmit = this.$('.btnsubmit');
            $butSubmit.button('loading');
            var frm= e.target;
            var data = {};

            $.each($(frm).serializeArray(), function() {
                data[this.name] = this.value;
            });

            data.To = MailList[data.To];
            if(!data.To){
                $butSubmit.button('reset');
                return;
            }

            data = {'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': 'employee@ra.rockwell.com',
                'To': { 'results': [ data.To ] },
                'Subject':  data.Subject,
                'Body': data.Body
            }};

            var posted = {data : data};
            var that = this;
            posted.success = function(){
                 that.showSuccessMsg('Post message successfully.');
                 $butSubmit.button('reset');
                 frm.reset();
            }

            posted.error = function(){
                that.showErrorMsg('Fail to post message');
                $butSubmit.button('reset');
            }
            
            app.modelHelper.get('suggestion').execute('suggestion:send:mail', posted);
            return false;
        }
    });
});