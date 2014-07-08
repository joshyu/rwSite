define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone, _, ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
           /* 'contacts:contactInfo' : {
                url: 'js/data/contact.json'
            },*/

            'contacts:contactInfo' : {
                dep : 'contacts:fulllist',
                parseData: 'fetchContactInfo'
            },

            'contacts:fulllist' : {
                url: 'js/data/contact_full.json',
                type: 'list',
                cached: true,
                parseData: '_parseRelationship',
            },

            'contacts:newhire' : {
                url: 'js/data/contact_newhire.json',
                type: 'list'
            },

            'contacts:birthday:recently' : {
                dep : 'contacts:fulllist',
                parseData : 'fetchRecentBirthday'
            }
        },

        //fetch whose birthday is in this month.
        fetchRecentBirthday: function(data){
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            month = 8;
            var days = new Date(year, month ,0).getDate();  // will get the day number of the month
            d = Date.parse(year + '/'+ month +'/' + days);
            var dayminiutes = 1000*3600*24 * days;

            data=  _.filter(data, function(item){
                if(!item.birthday){
                    return false;
                }

                var d1 = new Date(item.birthday).setFullYear(year);
                return d> d1 && (d - d1)  < dayminiutes;
            });
            return data;
        },

        fetchContactInfo: function(data, options){
            var itemId = options.id;
            if(!itemId)  return false;

            return data[itemId];
        },

        _parseRelationship: function(data){
             if(!data || !$.isArray(data)){
                return false;
            }

            var _data= {};

            $.each(data, function(i,item){
                var name = item.name;
                _data[name] = i;
            });

             $.each(data, function(i, item){
                 var managerItem = data[ _data[item.manager] ];
                 if(managerItem){
                     if(managerItem.reportees){
                        managerItem.reportees.push(i);
                     }else{
                        managerItem.reportees = [i];
                     }
                 }
             });

             return data;
        }
    });
});