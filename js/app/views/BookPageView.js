define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        threshold_new : '1', //books within how many months will be regarded as New.
        templateData: {
            title : 'Book Library',
            itemMode : false,  //itemMode is false, then we will show the results as table list.
            tableColumns : [
            	'Title' , 'Category' , 'Quantity'
            ],
            pageTip: 'Books bought within {threshold_new} month will be marked as \'new\''
        },

        initialize: function(){
            this.templateData.pageTip = this.templateData.pageTip.replace('{threshold_new}', this.threshold_new);
            this.panels.list.options.threshold_new = this.threshold_new;
            ListPageBaseView.prototype.initialize.apply(this, arguments);
        },

        panels: {
            list: {
              class: 'BookListView',
              options: {
                num : ListPageBaseView.prototype.loadnum,
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
                   name: 'Category/Id',
                   items : app.preloaded.teamCategoryNames
                }
           ];
        }
    });
});