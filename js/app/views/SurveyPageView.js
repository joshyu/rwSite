define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'Survey List'
        },

        panels: {
            list : {
                class: 'SurveyListView',
                options: {
                    num : ListPageBaseView.prototype.loadnum
                }
            }
        },

        loadSearch: function  () {
           var evtStates= app.modelHelper.get('campus_survey').getLibData('event_state');

           return [
                {
                   title : 'Sort By',
                   noAll : true,
                   name: 'order',
                   items : ['Newest' , 'Popular']
                },
                {
                    title : 'Event State',
                    name: 'status',
                    items : evtStates
                }
           ];
        }
    });
});