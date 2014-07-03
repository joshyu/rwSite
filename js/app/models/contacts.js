define([
    'app',
    'backbone'
], function (app, Backbone) {
    'use strict';
    return Backbone.Model.extend({
        initialize: function () {
             app.modelHelper.setHandler('contacts:fullList',  this.fetchContactLists, this);
             app.modelHelper.setHandler('contacts:contactInfo',  this.fetchContactInfo, this);
             app.modelHelper.setHandler('contacts:newhire',  this.fetchNewHireList, this);
             app.modelHelper.setHandler('contacts:birthday:recently',  this.fetchRecentBirthday, this);
        },

        fetchContactInfo: function(){
            var dfd= $.Deferred();

             var opts= {
                url: "js/data/contact.json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    dfd.resolve(data);
                }
            };

            Backbone.ajax(opts);            
            return dfd.promise();
        },

        fetchNewHireList: function(){
            var dfd= $.Deferred();

             var opts= {
                url: "js/data/contact_newhire.json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    dfd.resolve(data.data);
                }
            };

            Backbone.ajax(opts);            
            return dfd.promise();
        },

        fetchRecentBirthday: function  () {
             var dfd= $.Deferred();

             var opts= {
                url: "js/data/contact_birthday.json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    dfd.resolve(data.data);
                }
            };

            Backbone.ajax(opts);            
            return dfd.promise();
        }

    });
});