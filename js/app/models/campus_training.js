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
                queryParameters: {
                    expand: 'Category,Teacher,AttachmentFiles',
                    orderby: 'Created desc'
                },
                noHandleAttachedImage: true
            },

             'campus:events:training:updates:short' : {
                url:'items',
                type: 'list',
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "EventDate": "pubdate"
                },
                queryParameters: {
                    orderby: 'Created desc'
                }
            },
            'campus:events:training:userowned' : {
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
                queryParameters: {
                    expand: 'Category,Teacher,AttachmentFiles',
                    orderby: 'Created desc',
                    filters: "available eq 1"
                },
                noHandleAttachedImage: true
            },

            'campus:training:item:info' : {
                url:'items',
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
                queryParameters: {
                    expand: 'Category,Teacher,AttachmentFiles'
                },
                noHandleAttachedImage: true
            }
        },
        commands: {
            //TODO:
            'campus:events:training:markdone' : {
                //url: "js/data/postsuccess.jso.aspx"
                url : "items",
                type: 'update' //update, delete, create. by default it is update.
            },

            //deprecated.
            'campus:events:training:checktrcode' : {
                url : "items",
                //type: 'update' //update, delete, create. by default it is update.
            }
        },

        _lib : {
            training_states: ['available', 'closed']
        }
    });
});