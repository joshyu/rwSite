define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/notify_newhire'
], function(Marionette, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:'panel-body',
        request: {
            model: 'contacts',
            key: 'contacts:newhire'
        },

        templateData: {
            title: 'New Hire'
        },

        onRender: function () {
            var that = this;

            this.$el.find('.carousel').carousel({interval: 6000});
            app.modelHelper.get('contacts').fetchListPermissionForCurUser('newhire').then(function(link) {
                if (link) {
                    that.$el.prepend(app.modelHelper.get('roles').getEditLinkHtml(link));
                }
            });
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