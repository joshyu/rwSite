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
            this.setViewFullButtons();
            this.$el.find('.carousel').carousel({interval: 6000}).on('slid.bs.carousel', function(){
                that.setViewFullButtons();
            });
        },

        events: {
            'click .profilelink' :  'clickProfile',
            'click .viewfull' : 'viewFull'
        },

        clickProfile: function(e){
            var domTrigger= e.currentTarget;
            var empId= Marionette.$(domTrigger).data('employee-id');
            if(empId){
                ModalHelper.get('employee', {itemId: empId, domTrigger: domTrigger}).show();
            }
            return false;
        },

        setViewFullButtons: function(){
            var $active = this.$el.find('.carousel .item.active .statement');
            if(!$active || $active.length === 0) return false;
            if($active.next().find('.viewfull').length > 0) return false;

            var item = $active[0];
            var sh = item.scrollHeight; // scrollheight
            var lh = parseFloat($(item).css('line-height'));  //lineheight
            var hh = item.offsetHeight;  //height
            var index = Number($active.data('item-index'));

            if(sh > hh){
                //hh = sh - Math.ceil((sh - hh)/ lh) * lh;  //new height;
                hh = Math.floor(hh / lh) * lh;
                $(item).css('height', hh+'px');                
                $(item).next().append('<a href="#" class="viewfull" data-item-id="'+ index +'">View Full</a>');
            }
        },

        viewFull: function(e){
            var link= e.target;
            var hireIndex= Number($(link).data('item-id'));
            e.preventDefault();

            if(isNaN(hireIndex)) return false;
            var info = this._templateData.contacts[hireIndex];
            if(!info) return false;

            info = { title: info.name, content: info.intro};
            ModalHelper.get('news', {data: info}).show();
        }
    });
});