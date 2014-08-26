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
        modelId: 'campus_survey',
        panels: {
            list : {
                class: 'SurveyListView',
                options: {
                    num : ListPageBaseView.prototype.loadnum
                }
            }
        },

        loadSearch: function  () {
           var evtStates= app.modelHelper.get(this.modelId).getLibData('event_state');

           return [
                {
                   title : 'Sort By',
                   noAll : true,
                   name: 'orderby',
                   items : [
                        {
                            id: 'Id desc',
                            title: 'Newest'
                        },
                        {
                            id: 'numVoted desc',
                            title: 'Popular'
                        }
                   ]
                },
                {
                    title : 'Event State',
                    name: evtStates.name, 
                    items : evtStates.states
                }
           ];
        }
    });
});