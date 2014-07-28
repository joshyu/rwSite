define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'Survey List',
            noSearchBox : true
        },

        panels: {
            list : {
                class: 'SurveyListView',
                options: {
                    num : ListPageBaseView.prototype.loadnum
                }
            }
        }
    });
});