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
            numperpage: '3'
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

        _splitArray: function(arr, num){
            if(arr.length <= num) return [ arr ];
            var _arr= [];
            while(arr.length > 0){
                _arr.push(arr.splice(0,num));
            }

            return _arr;
        },

        renderData: function (data) {
            data.contacts = this._splitArray(data.contacts, this.templateData.numperpage);
            ViewBase.prototype.renderData.apply(this, arguments);           
        },

        onRender: function() {
            /*this.$el.find('.panel-notify-sub-list  .carousel-birthday  a.profilelink    img').tooltip()*/;
            this.$el.find('.carousel').carousel({interval: false});
        }
    });
});