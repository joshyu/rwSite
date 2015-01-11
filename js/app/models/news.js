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
                    expand: 'Author0',
                    //filters: 'Is_x0020_it_x0020_General_x0020_  ne 1'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author0/Title":"author",
                    "NewsDate": "pubdate",
                    "Is_x0020_it_x0020_General_x0020_": 'isgeneral'
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
                    "NewsDate": "pubdate",
                    "Is_x0020_it_x0020_General_x0020_": 'isgeneral'
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