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
                data: {
                    orderby: 'BuyDate desc'
                },
                
                returnFields : {
                    "Id" : "id",
                    "Title" : "title",
                    "Category/Title" : "category",
                    "Quantity" : "quantity",
                    "BuyDate" : "pubdate"
                }
            }
        }
    });
});