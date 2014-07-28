define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'Book Library',
            itemMode : false,  //itemMode is false, then we will show the results as table list.
            tableColumns : [
            	'Title' , 'Category' , 'Quantity'
            ]
        },

        panels: {
            list: {
              class: 'BookListView',
              options: {
                num : ListPageBaseView.prototype.loadnum
              },
              showOptions: {
                 itemMode : false
              }
            }
        },

        loadSearch: function  () {
           return [
                {
                   title : 'Book Category',
                   name: 'category',
                   items : app.preloaded.teamCategoryNames
                }
           ];
        }
    });
});