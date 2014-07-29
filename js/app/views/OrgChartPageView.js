define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        className:"container campuslistpage cplp-nolist",
        templateData: {
            title : 'Organization Chart',
            noMoreButton : true,
            noSearchBox : true
        },

        panels: {
            list : {
                class: 'OrgChartListView'
            }
        }
    });
});