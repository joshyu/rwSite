define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        className:"container campuslistpage cplp-nolist",
        templateData: {
            title : 'Project Management',
            pageTip : 'hover on the image to see its description, click to enlarge it.',
            noMoreButton : true,
            noSearchBox : true
        },

        panels: {
            list : {
                class: 'ProjectManListView'
            }
        }
    });
});