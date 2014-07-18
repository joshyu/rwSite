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
                options: {pageId: 'src'}
            }
        },

        loadSearch: function  () {
           var evtStates= app.modelHelper.get('campus_src').getLibData('event_state');

           return [
                {
                   title : 'Event Category',
                   name: 'category',
                   items : app.preloaded.srcCategoryNames
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