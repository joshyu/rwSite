define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'book',
        requests: {
            'campus:book:updates' : {
                url: 'items',
                type: "list",
                queryParameters: {
                    orderby: 'BuyDate desc',
                    expand: 'Category'
                },
                
                returnFields : {
                    "Id" : "id",
                    "Title" : "title",
                    "Category/Title" : "category",
                    "Quantity" : "quantity",
                    "BuyDate" : "pubdate"
                }
            }
        },
        permissionDef: {
            link: '/campus/Lists/books/AllItems.aspx',
            perm: 'editListItems',
            urlKey: 'items'
        }
    });
});