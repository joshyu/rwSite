define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'SRC Events',
            loadnum : ListPageBaseView.prototype.loadnum
        },

        panels: {
            list : {
                class: 'SrcListView',
                options: {
                	pageId: 'src',
                	loadnum: ListPageBaseView.prototype.loadnum
                },

                showOptions: {
                	preventClose : true
                }
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