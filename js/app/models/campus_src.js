define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function(app, Backbone, _, ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'src',
        requests: {
            'campus:events:src:updates': {
                url: "items",
                type: "list",
                data: {
                    num: 5,
                    orderby: 'Created desc'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Author/Title":"author",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink"
                }
            },

            'campus:events:src:count': {
                url: "items",
                listProperties: "ItemCount",
                returnFields: "ItemCount"
            },

            //TODO: will be updated later.
            'campus:events:src:userowned': {
                deps: 'campus:events:src:updates'
            },

            'campus:src:item:info': {
                url: "item",
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Author/Title":"author",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink"
                }
            },

            'campus:src:categoryNames': {
                url: 'categoryNames',
                cached: true,
                type: "list",
                returnFields: {
                    "Id": "id",
                    "Attachments": "",
                    "AttachmentFiles": "attachments",
                    "Title": "title"
                }
            }
        },

        _lib: {
            event_state: ['available', 'closed']
        }
    });
});