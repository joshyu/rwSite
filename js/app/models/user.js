define([
    'app',
    'backbone'
], function (app, Backbone) {
    'use strict';
    var _cached = {};

    return Backbone.Model.extend({
        initialize: function () {
             app.modelHelper.setHandler('user:info',  this.fetchUserInfo, this);
        },

        fetchUserInfo: function  () {
            var dfd= $.Deferred();

            if(_cached.userinfo){
                dfd.resolve(_cached.userinfo);
            }else{
                var opts= {
                    url: "js/data/user.json",
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){
                        dfd.resolve(data);
                    }
                };

                Backbone.ajax(opts);
            }
            
            return dfd.promise();
        }

    });
});