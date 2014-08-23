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
                    "contact/Title": "author",
                    "Attachments": "",
                    "content": "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "joinLinkTitle":"joinLinkTitle",
                    "available": "available"
                },
                queryParameters: {
                    expand: 'Category,AttachmentFiles,contact',
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

            //fetch those available and not outdated src events.
            'campus:events:src:fresh': {
                url: 'items',
                type: 'list',
                getQueryParameters: function(){
                    var _params = {
                        expand: 'Category,AttachmentFiles,contact',
                        orderby: 'EventDate desc'
                    };

                    _params.filters = "available eq 1 and EventDate gt datetime'"+ new Date().toISOString()  +"'";
                    return _params;
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "contact/Title": "author",
                    "contact/Id" : "authorId",
                    "Attachments": "",
                    "content": "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "joinLinkTitle":"joinLinkTitle",
                    "available": "available"
                }
            },

            'campus:events:src:userowned': 'getUserOwnedSrc',

            'campus:src:item:info': {
                url: "items",
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "contact/Title": "author",
                    "Attachments": "",
                    "content": "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "joinLinkTitle":"joinLinkTitle",
                    "available": "available"
                },
                queryParameters: {
                    expand: 'Category,AttachmentFiles,contact'
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

        getUserOwnedSrc: function(data){
            var namedId = data.nameId;
            var that = this;
            return this.request('campus:events:src:fresh').then(function(items) {
                return that.filterUserJoinedItem(items, namedId);
            });
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