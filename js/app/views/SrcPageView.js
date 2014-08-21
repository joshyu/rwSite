define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'SRC Events'
        },

        panels: {
            list : {
                class: 'SrcListView',
                options: {
                    pageId: 'listpage',
                    num : ListPageBaseView.prototype.loadnum
                }
            }
        },

        loadSearch: function  () {
           var evtStates= app.modelHelper.get('campus_src').getLibData('event_state');

           return [
                {
                   title : 'Event Category',
                   name: 'Category/Id',
                   items : app.preloaded.srcCategoryNames
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