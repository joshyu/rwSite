define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'SRC Events',
            searchCatTitle : 'Event Category'
        },

        loadSearch: function  () {
        		var filters = [];

        		filters.push({
        			title : 'Event Category',
        			name: 'category',
        			items : app.preloaded.srcCategoryNames
        		});

        		filters.push({
        			title : 'Event State',
        			name: 'status',
        			items : ['Upcoming', 'Outdated']
        		});


        		return filters;
        }

    });
});