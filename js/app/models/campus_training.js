define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'training',
        requests: {
            'campus:events:training:updates' : {
                url:'items',
                type: 'list',
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Teacher/Title":"author",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "timespan": "timespan",
                    "TrainingCode": "trainingcode",
                    "TrainingRoom": "room",
                    "Rank": "Rank",
                    "numJoined": "numJoined",
                    "available" : "available"
                },
            },
            'campus:events:training:userowned' : {
                deps: 'campus:events:training:updates'
            },

            'campus:training:item:info' : {
                url: "js/data/training_item.jso"
            }
        },
        commands: {
            'campus:events:training:markdone' : {
                url: "js/data/postsuccess.jso.aspx"
            },

            'campus:events:training:checktrcode' : {
                url: "js/data/postsuccess.jso.aspx"
            }
        },

        _lib : {
            training_states: ['available', 'closed']
        }
    });
});