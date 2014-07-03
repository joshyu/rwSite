define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/modalbase'
], function(Marionette, app, ViewBase,template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        bodyTmpl: null,  //content view.
        className:'modal fade',
        
        onRender: function(){
            this.$el.appendTo(document.body);
            this.hilightTrigger();
            var $domTrigger= $(this.options.domTrigger);
            this.$el.on('hidden.bs.modal', function(){
                this.remove();
                $domTrigger.removeClass('highlight');
            });
        },

        hilightTrigger :function(){
            $(this.options.domTrigger).addClass('highlight');
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
            }

            return data;
        },

         renderData: function  (data) {
            data = _.extend(this.myTemplData(), this.handleData(data));
            data.itemdata = this.bodyTmpl ? this.bodyTmpl(data) : '';
            this.$el.html(this.template(data));
            this.triggerMethod("render", this);
        }
    });
});