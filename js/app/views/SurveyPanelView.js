define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/survey',
], function(Marionette, app, ViewBase, ModalHelper,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        events: {
            'click .list-group-survey .list-group-item':  'clickSurveyLink'
        },

        requests: [
            {
                id: 'new',
                model: 'campus_survey',
                key: 'campus:survey:newest'
            },
            {
                id: 'popular',
                model: 'campus_survey',
                key: 'campus:survey:popular'
            }
        ],

        templateData: {
            title: "Campus Survey",
            subtitle_new: 'New Survey',
            subtitle_popular:'Popular Survey'
        },

        clickSurveyLink: function(e){
            var domTrigger= e.currentTarget;
            var itemId= Marionette.$(domTrigger).data('item-id');
            if(itemId){
                ModalHelper.get('survey', {itemId: itemId, domTrigger: domTrigger}).show();
            }
            return false;
        }

    });
});