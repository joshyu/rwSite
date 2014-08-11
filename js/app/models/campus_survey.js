define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'campus:survey:newest' : {
                url: "js/data/survey_newest.jso",
                type: 'list'
            },

            'campus:survey:popular' : {
                url:'js/data/survey_popular.jso',
                type: 'list'
            },

            'campus:survey:item:info' : {
                url: 'js/data/survey_item.jso'
            }
        },

        _lib : {
            event_state: ['available', 'closed']
        }
    });
});