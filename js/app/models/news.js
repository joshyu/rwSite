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
                    num: 5,
                    orderby: 'NewsDate desc'
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Author0/Title":"author",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "NewsDate": "pubdate"
                }
            }
        }      
    });
});