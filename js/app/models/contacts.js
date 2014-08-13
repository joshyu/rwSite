define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone, _, ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'contacts',
        requests: {
            'contacts:contactInfo' : {
                deps : 'contacts:fulllist',
                parseData: 'fetchContactInfo'
            },

            'contacts:fulllist' : {
                url: "items",
                type: 'list',
                cached: true,
                data: {
                    num: 9999 //in order to retrieve the full list not the first 100 items.
                },
                parseData: '_parseRelationship',
                 returnFields: {
                    "Id": "id",
                    "FullName/Id" : "nameRecordId",
                    "FullName/Title": "name",
                    "FullName/Chinese_x0020_Name": "chinesename",
                    "E_x002d_mail_x0020_Address":"email",
                    "Project": "project",
                    "Photo/Url" : "photo",
                    "Lead": "supervisor",
                    "Manager": "manager",
                    "Team0/Title": "team",
                    "Ext_x0020_Number": "ext",
                    "Birthday" : "birthday"
                }
            },

            'contacts:newhire' : {
                url : "newhires",
                type: "list",
                returnFields: {
                    "Id": "id",
                    "Introduction": "intro",
                    "FullNameId": "nameRecordId"
                },
                parseData: '_fetchNewHireFullData'
            },

            'contacts:birthday:recently' : {
                deps : 'contacts:fulllist',
                parseData : 'fetchRecentBirthday'
            },

            'contacts:teamCategoryNames' : {
                url: "teams",
                type: "list",
                returnFields: {
                    "Id": "id",
                    "Title": "name"
                }
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
                    d1 = new Date(item.birthday);
                    item.birthday = (d1.getMonth()+1) + "/" + d1.getDate();
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
                 var supervisorItem = data[ _data[ item.supervisor ]];
                 if(supervisorItem){
                    item.managerId = supervisorItem.nameRecordId;
                     if(supervisorItem.reportees){
                        supervisorItem.reportees.push(item);
                     }else{
                        supervisorItem.reportees = [ item ];
                     }
                 }else{
                    _roots.push(item);
                 }
             });

            _data = {};
            $.each(data, function(i,item){
                _data[item.nameRecordId] = item;
            });

            _data.roots = _roots;
             return _data;
        },

        _fetchNewHireFullData: function(newhires){
            var emplist = this.getCached('contacts:fulllist');
            return _.map(newhires, function(emp){
                var empData = emp.nameRecordId && emplist && emplist[emp.nameRecordId];
                return _.extend(emp, empData);
            });
        }
    });
});