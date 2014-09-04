define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/general/modalbase',
    'noty'
], function(Marionette, app, ViewBase,template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        bodyTmpl: null,  //content view.
        className:'modal fade',
        
        onRender: function(){
            this.$el.appendTo(document.body);

            var hasDomTrigger = !!this.options.domTrigger;
            var $domTrigger= hasDomTrigger && $(this.options.domTrigger);
            if(hasDomTrigger){
                $domTrigger.addClass('highlight');    
            }            
            
            this.$el.on('hidden.bs.modal', function(){
                $(this).remove();
                 app.jobHelper.clearTimer("modal");

                 if(hasDomTrigger){
                    $domTrigger.removeClass('highlight');
                 }
            });
        },

        showMessage: function(options){
            this.$('.modal-content').noty(options);
        },

        showSuccessMsg: function(txt){
            this.showMessage({
                timeout:500,
                type:'success',
                text : txt
             });
        },

        showErrorMsg:  function(txt){
            this.showMessage({
                timeout:500,
                type:'error',
                text : txt
             });
        },

        show: function(){
            this.$el.modal({backdrop: 'static', keyboard: false});
        },

        handleData: function(data){
            data = data || {};
            
            if(data.title){
                return data;
            }

            for(var key in data){
                data.title= data[key].title;
                break;
            }

            return data;
        },

         renderData: function  (data) {
            data = _.extend(this.myTemplData(), this.handleData(data));
            this._templateData = data;
            data.itemdata = this.bodyTmpl ? this.bodyTmpl(data) : '';
            this.$el.html(this.template(data));
            this.triggerMethod("render", this);
        }
    });
});