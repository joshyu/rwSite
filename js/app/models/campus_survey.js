define([
    'app',
    'backbone',
    'underscore',
    'models/SPService'
], function (app, Backbone,  _,  SPService) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: 'Survey List',
        },

        initialize: function () {
            //this.service = SPService.List('_sys', 'navigation');
            app.modelHelper.setHandler('campus:survey:newest',  this.fetchNewestSurveys, this);
            app.modelHelper.setHandler('campus:survey:popular',  this.fetchPopularSurveys, this);
        },

        fetchPopularSurveys: function () {
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/survey_popular.json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    dfd.resolve(data.data);
                }
            };

            Backbone.ajax(opts);
            return dfd.promise();
        },

        fetchNewestSurveys: function () {
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/survey_newest.json",
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