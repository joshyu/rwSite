define([
    'marionette',
    'app',
    'views/ViewBase',
    'text!templates/modalbase.html',
    'hbs/handlebars'
], function(Marionette, app, ViewBase,template,Handlebars) {
    'use strict';
    return ViewBase.extend({
        template: template,
        bodyTmpl: null,  //content view.
        className:'modal fade',
        
        onRender: function(){
            this.$el.appendTo(document.body);
            this.$el.on('hidden.bs.modal', function(){
                this.remove();
            });
        },

        show: function(){
            this.$el.modal({backdrop: 'static', keyboard: false});
        },

        handleData: function(data){
            if(data.title){
                return data;
            }

            for(var key in data){
                data.title= data[key].title;
            }

            return data;
        },

         renderData: function  (data) {
            data = this.handleData(data);
            Handlebars.compile(this.bodyTmpl);
            Handlebars.registerPartial('itemdata', this.bodyTmpl);
            var template = Handlebars.compile(this.template);
            this.$el.html(template(data));
            this.triggerMethod("render", this);
        }
    });
});