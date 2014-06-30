define([
    'app',
    'backbone',
    'underscore',
    'models/SPService'
], function (app, Backbone,  _,  SPService) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: 'Campus News',
        },

        initialize: function () {
            //this.service = SPService.List('_sys', 'navigation');
            app.modelHelper.setHandler('campus:news:list',  this.fetchList, this);
        },

        fetchList: function() {
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/news.json",
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