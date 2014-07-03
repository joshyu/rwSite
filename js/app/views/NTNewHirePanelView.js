define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/notify_newhire'
], function(Marionette, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:'panel-body',
        request: {
            model: 'contacts',
            key: 'contacts:newhire',
            data: {
                title : 'New Hire'
            }
        },

        templateData: {
            title: 'New Hire'
        },

        onRender: function () {
            this.$el.find('.carousel').carousel({interval: 6000});
        },

        events: {
            'click .profilelink' :  'clickProfile'
        },

        clickProfile: function(e){
            var domTrigger= e.currentTarget;
            var empId= Marionette.$(domTrigger).data('employee-id');
            if(empId){
                ModalHelper.get('employee', {itemId: empId, domTrigger: domTrigger}).show();
            }
            return false;
        }
    });
});