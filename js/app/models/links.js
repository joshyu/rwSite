define([
    'app',
    'backbone',
    'underscore',
    'models/SPService'
], function (app, Backbone,  _,  SPService) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: 'Quick Links',
        },

        initialize: function () {
            //this.service = SPService.List('_sys', 'navigation');
            app.modelHelper.setHandler('links:quicklinks',  this.fetchQuickLinks, this);
        },

        fetchQuickLinks: function() {
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/qlinks.json",
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