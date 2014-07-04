define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'campus:survey:newest' :  "fetchNewestSurveys",
            'campus:survey:popular' : 'fetchPopularSurveys',
            'campus:survey:item:info' : 'fetchSurveyItem'
        },

        fetchSurveyItem: function(args){
            return this._fetchItem({
                url: "js/data/survey_item.json",
                data: {
                    id: args.id
                }
            });
        },

        fetchPopularSurveys: function () {
            return this._fetchList({
                url: "js/data/survey_popular.json"
            });
        },

        fetchNewestSurveys: function () {
             return this._fetchList({
                url: "js/data/survey_newest.json"
            });
        }
    });
});