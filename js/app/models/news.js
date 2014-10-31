define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'news',
        requests: {
            'campus:news:list' : {
                type: "list",
                url: "items",
                data: {
                    num: 5
                },
                queryParameters: {
                    orderby: 'NewsDate desc',
                    expand: 'Author0'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author0/Title":"author",
                    "NewsDate": "pubdate"
                }
            },
             'campus:news:item' : {
                url: "items",
                queryParameters: {
                    orderby: 'NewsDate desc',
                    expand: 'AttachmentFiles,Author0'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author0/Title":"author",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "NewsDate": "pubdate"
                },

                noHandleAttachedImage: true
            }
        },
        permissionDef: {
            link: '/campus/Lists/News/AllItems.aspx',
            perm: 'editListItems',
            urlKey: 'items'
        }
    });
});