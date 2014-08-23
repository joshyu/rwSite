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
                queryParameters:{
                    orderby: 'Id desc',
                    expand: 'Author'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author/Title":"author",
                    "Content" : "content",
                    "Created": "pubdate",
                    "link": "votelink",
                    "joinLinkTitle":"joinLinkTitle",
                    "available":"available"
                }
            },

            'campus:survey:newest:short' : {
                url: "items",
                type: 'list',
                queryParameters:{
                    orderby: 'Id desc'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Created": "pubdate"
                }
            },

            'campus:survey:popular' : {
                url: "items",
                type: 'list',
                queryParameters:{
                    orderby: 'numVoted desc',
                    expand: 'Author'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author/Title":"author",
                    "Content" : "content",
                    "Created": "pubdate",
                    "link": "votelink",
                    "joinLinkTitle":"joinLinkTitle",
                    "available":"available"
                }
            },

            'campus:survey:popular:short' : {
                url: "items",
                type: 'list',
                queryParameters:{
                    orderby: 'numVoted desc'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title"
                }
            },

            'campus:survey:item:info' : {
                url: "items",
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author/Title":"author",
                    "Content" : "content",
                    "Created": "pubdate",
                    "link": "votelink",
                    "joinLinkTitle":"joinLinkTitle",
                    "available":"available"
                },
                queryParameters:{
                    expand: 'Author'
                }
            }
        },

        _lib : {
            event_state: {
                name: 'available',
                states: [
                    {
                        id: 1,
                        title: 'available'
                    },
                    {
                        id: 0,
                        title: 'closed'
                    }
                ]
            }
        }
    });
});