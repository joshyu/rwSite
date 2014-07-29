define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/projectmanage',
    'views/ModalHelper'
], function(Marionette, app, ViewBase,  template, ModalHelper) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-body-list-inner',
        request : {
            model : 'campus_office',
            key: 'campus:project:list'
        },

        events: {
            'click .pm-image' : 'viewProductDetail'
        },

        viewProductDetail: function(e){
            var domTrigger= e.currentTarget;
            var _index= $(domTrigger).data('item-index');
            var _data = this._templateData.campus_office[_index];
            if(!_data) return false;

            ModalHelper.get('pmImage', {data: _data, domTrigger: domTrigger}).show();
            return false;
        }
    });
});