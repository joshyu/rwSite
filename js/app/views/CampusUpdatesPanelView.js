define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/campus_update',
], function(Marionette, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        ui: {
            srcLinks : '.list-group-src  .list-group-item',
            trainingLinks: '.list-group-training .list-group-item'
        },
        events: {
            'click @ui.srcLinks': 'clickSrcLink'
        },
        requests: [
            {
                model: 'campus_src',
                key: 'campus:events:src:updates'
            },
            {
                model: 'campus_training',
                key: 'campus:events:training:updates'
            }
        ],

        clickSrcLink: function(e){
            //pop up modal dialog.
            var trigger= e.target;
            var itemId= Marionette.$(trigger).data('item-id');
            if(itemId){
                ModalHelper.get('src', {itemId: itemId, trigger: trigger}).show();
            }
            return false;
        }


    });
});