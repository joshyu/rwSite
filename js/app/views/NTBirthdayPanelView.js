define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/notify_birthday'
], function(Marionette, app, ViewBase,  ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className: 'panel-body',
        templateData: {
            title: 'Birthday',
        },
        
        request: {
            model: 'contacts',
            key: 'contacts:birthday:recently'
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
        },

        onRender: function() {
            var $carouselDom= this.$el.find('.carousel');
            if($carouselDom.find('.item').length > 1){
                $carouselDom.carousel({interval: 5000});    
            }
        }
    });
});