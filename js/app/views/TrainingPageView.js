define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        templateData: {
            title : 'Training Center',
            caption: "Training plan for 2014",
            tip : 'click each line of items to see the detail of the training session.',
            itemMode : false,  //itemMode is false, then we will show the results as table list.
            tableColumns : [
            	'Title' , 'Trainer' , 'Date', 'Duration', 'Difficulty', 'Category', 'State'
            ]
        },

        panels: {
            list: {
              class: 'TrainingPageListView',
              options: {
                pageId: 'listpage',
                num : ListPageBaseView.prototype.loadnum
              },
              showOptions: {
                 itemMode : false
              }
            }
        },

        loadSearch: function  () {
          var trStates= app.modelHelper.get('campus_training').getLibData('training_states');

           return [
                {
                   title : 'Training Category',
                   name: 'category',
                   items : app.preloaded.teamCategoryNames
                },
                {
                    title : 'Training State',
                    name: 'status',
                    items : trStates
                }
           ];
        }
    });
});