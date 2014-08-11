define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        className:"container campuslistpage cplp-nolist",
        templateData: {
            title : 'Office Layout',
            pageTip : 'click on the image to enlarge it.',
            noMoreButton : true,
            noSearchBox : true
        },

        panels: {
            list : {
                class: 'OfficeLayoutListView'
            }
        }
    });
});