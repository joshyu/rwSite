define([
    'marionette',
    'app',
    'views/EmpItemView',
    'hbs!templates/general/modalbase',
    'hbs/handlebars'
], function(Marionette, app, EmpItemView,template,Handlebars) {
    'use strict';
    return Marionette.Layout.extend({
        template: template,
        bodyTmpl: null,  //content view.
        className:'modal fade contact_modal',
        regions: {
            content: '.modal-body'
        },

        initialize: function(){
            this.render();
        },

        hilightTrigger :function(){
            $(this.options.domTrigger).addClass('highlight');
        },

        onRender: function(){
            var itemId= this.options.itemId;
            this.getRegion('content').show(new EmpItemView({itemId: itemId}));
            this.hilightTrigger();
            this.$el.appendTo(document.body);
            var $domTrigger= $(this.options.domTrigger);
            this.$el.on('hidden.bs.modal', function(){
                this.remove();
                $domTrigger.removeClass('highlight');
            });
        },

        show: function(){
            this.$el.modal({backdrop: 'static', keyboard: false});
        }
    });
});