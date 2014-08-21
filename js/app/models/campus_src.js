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
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Author/Title": "author",
                    "Attachments": "",
                    "content": "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "available": "available",
                    'numJoined': 'numJoined'
                },
                queryParameters: {
                    expand: 'Category,AttachmentFiles,Author',
                    orderby: 'EventDate desc'
                }
            },

            'campus:events:src:updates:short': {
                url: "items",
                type: "list",
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "EventDate": "pubdate"
                },
                queryParameters: {
                    orderby: 'EventDate desc'
                }
            },

            'campus:events:src:count': {
                url: "items",
                listProperties: "ItemCount",
                returnFields: "ItemCount"
            },

            //TODO: will be updated later.
            'campus:events:src:userowned': {
                url: "items",
                type: "list",
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Author/Title": "author",
                    "Attachments": "",
                    "content": "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "available": "available",
                    'numJoined': 'numJoined'
                },
                queryParameters: {
                    expand: 'Category,AttachmentFiles,Author',
                    orderby: 'EventDate desc',
                    filters: "available eq 1"
                }
            },

            'campus:src:item:info': {
                url: "items",
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Author/Title": "author",
                    "Attachments": "",
                    "content": "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "available": "available",
                    'numJoined': 'numJoined'
                },
                queryParameters: {
                    expand: 'Category,AttachmentFiles,Author'
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
                },

                queryParameters: {
                    expand: 'AttachmentFiles'
                }
            }
        },

        handleEventImage: function(data){
            if(!_.isArray(data)){
                return this.handleItemEventImage(data);
            }

            return _.map(data, this.handleItemEventImage, this);
        },

        handleItemEventImage: function(item){
            if(!item.imageUrl){
                item.imageUrl = _.find( app.preloaded.srcCategoryNames  , {title: item.category}).imageUrl;
            }

            return item;
        },

        _lib: {
            event_state : {
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