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

        getTitle: function(){
            return this.title || '';
        },

        onRender: function(){
            this.$el.appendTo('body');
            this.$el.on('hidden.bs.modal', function(){
                this.remove();
            });
        },

        getbodyContent: function(){
            if(this.bodyTmpl){
                return this.bodyTmpl();
            }
        },

        show: function(){
            this.$el.modal({backdrop: 'static', keyboard: false});
        },

        getFooter: function(){
             return this.footer || '';
        },

        myTemplData: function(){
            var data= {};
            data.title = this.getTitle();
            data.body = this.getbodyContent();
            data.footer = this.getFooter();
            return data;
        }
    });
});