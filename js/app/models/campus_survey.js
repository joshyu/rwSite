define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'survey',
        requests: {
            'campus:survey:newest' : {
                url: "items",
                type: 'list',
                data:{
                    orderby: 'Id desc'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author/Title":"author",
                    "Content" : "content",
                    "Created": "pubdate",
                    "link": "votelink",
                    "available":"available",
                    "numVoted":"numVoted"
                }
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