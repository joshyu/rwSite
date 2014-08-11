define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone, _, ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'contacts:contactInfo' : {
                dep : 'contacts:fulllist',
                parseData: 'fetchContactInfo'
            },

            'contacts:fulllist' : {
                url: 'js/data/contact_full.jso',
                type: 'list',
                cached: true,
                parseData: '_parseRelationship',
            },

            'contacts:newhire' : {
                url: 'js/data/contact_newhire.jso',
                type: 'list'
            },

            'contacts:birthday:recently' : {
                dep : 'contacts:fulllist',
                parseData : 'fetchRecentBirthday'
            },

            'contacts:teamCategoryNames' : {
                url: "js/data/team_categoryNames.jso",
                type: "list"
            }
        },

        //fetch whose birthday is in this month.
        fetchRecentBirthday: function(data){
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var days = new Date(year, month ,0).getDate();  // will get the day number of the month
            d = Date.parse(year + '/'+ month +'/' + days);
            var dayminiutes = 1000*3600*24 * days;

            data=  _.filter(data, function(item){
                if(!item.birthday){
                    return false;
                }

                var d1 = new Date(item.birthday).setFullYear(year);
                var pass = d> d1 && (d - d1)  < dayminiutes;
                if(pass){
                    item.birthday = item.birthday.replace(/\/?\b\w{4}\b\/?/,'');
                }

                return pass;

            });

            var _empty = data.length === 0; 

            data =  this._splitArray(data);
            data.morepage = data.length > 1;
            data.empty = _empty;

            return data;
        },

        _splitArray: function(arr, num){
            var NUMPERPAGE = 3;
            num = num || NUMPERPAGE;

            if(arr.length <= num){
                return [ arr ];
            }

            var _arr= [];
            while(arr.length > 0){
                _arr.push(arr.splice(0,num));
            }

            return _arr;
        },

        fetchContactInfo: function(data, options){
            var itemId = options.id;
            var item = null;
            if(itemId){
                item= data[itemId];
            }else{
                //get the user info of current signed in user.
                var _email = app.preloaded.user.info.email;
                item = _.find(data, function(item){
                    return item.email === _email;
                });
            }            

            item.relations= this._fetchRelationData(data, item);
            return item;            
        },

        _fetchRelationData: function(data, item){
             if(!data || !item){
                return false;
             } 

             var _relations = {};
             if(item.managerId){
                _relations.manager = data[item.managerId];
             }

             _relations.reportees = item.reportees;
             return _relations;
        },
        _parseRelationship: function(data){
             if(!data || !$.isArray(data)){
                return false;
            }

            var _data= {};
            var _roots = [];

            $.each(data, function(i,item){
                var name = item.name;
                _data[name] = i;
            });

            $.each(data, function(i, item){
                 var managerItem = data[ _data[item.manager] ];
                 if(managerItem){
                    item.managerId = managerItem.id;
                     if(managerItem.reportees){
                        managerItem.reportees.push(item);
                     }else{
                        managerItem.reportees = [item];
                     }
                 }else{
                    _roots.push(item);
                 }
             });

            _data = {};
            $.each(data, function(i,item){
                _data[item.id] = item;
            });

            _data.roots = _roots;
             return _data;
        }
    });
});