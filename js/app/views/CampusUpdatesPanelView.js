define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/campus_update',
], function(Marionette, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        ui: {
            srcLinks : '.list-group-src  .list-group-item',
            trainingLinks: '.list-group-training .list-group-item'
        },
        events: {
            'click @ui.srcLinks': 'clickSrcLink',
            'click @ui.trainingLinks': 'clickTrainingLink'
        },

        templateData: {
            title: 'Campus Updates',
            subtitle_src: 'SRC Events',
            subtitle_training: 'Training Center'
        },
        requests: [
            {
                model: 'campus_src',
                key: 'campus:events:src:updates:short',
                options: {num:5}
            },
            {
                model: 'campus_training',
                key: 'campus:events:training:updates:short',
                options: {num:5}
            }
        ],

        clickSrcLink: function(e){
            //pop up modal dialog.
            var domTrigger= e.currentTarget;
            var itemId= Marionette.$(domTrigger).data('item-id');
            if(itemId){
                ModalHelper.get('src', {itemId: itemId, domTrigger: domTrigger}).show();
            }
            return false;
        },

        clickTrainingLink: function(e){
            var domTrigger= e.currentTarget;
            var itemId= Marionette.$(domTrigger).data('item-id');
            if(itemId){
                ModalHelper.get('training', {itemId: itemId, domTrigger: domTrigger}).show();
            }
            return false;
        }


    });
});