define([
    'marionette',
    'app',
    'views/ListPageBaseView'
], function(Marionette, app, ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        noAjax : true,
        templateData: {
            title : 'Contact List',
            itemMode : false,  //itemMode is false, then we will show the results as table list.
            tableColumns : [
            	'', 'English Name' , 'Chinese Name' , 'Extension Number', 'Team', 'Manager']
        },

        panels: {
            list: {
              class: 'ContactListView',
              options: {
                num : ListPageBaseView.prototype.loadnum
              },
              showOptions: {
                 itemMode : false
              }
            }
        },

        loadSearch: function(){
          var chars='abcdefghijklmnopqrstuvwxyz';
           return [
                {
                   title : 'Book Category',
                   name: 'category',
                   items : app.preloaded.teamCategoryNames
                },
                {
                  title : 'Filter By Alphabet',
                  name: 'start_char',
                  items : chars.match(/\w/g)
                }
           ];
        }
    });
});