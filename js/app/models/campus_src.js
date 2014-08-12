define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'src',
        requests: {
            'campus:events:src:updates' : {
                url : "items",
                type: "list",
                data: {
                    num: 5,
                    orderby: 'Created desc'
                },

                returnFields : {
                    "Id" : "id",
                    "Title" : "title",
                    "Category/Title" : "category"
                }
            },

            'campus:events:src:count' : {
                url : "items",
                data: {
                    inlinecount: "allpages"
                },

                returnFields: "__count"
            },
            
            //TODO: will be updated later.
             'campus:events:src:userowned' : {
                deps: 'campus:events:src:updates'
            },

            'campus:src:item:info' :{
                url : "item",
                returnFields : {
                    "Id" : "id",
                    "Title" : "title",
                    "Category/Title" : "category"
                }
            },

            'campus:src:categoryNames' :{
                url : 'categoryNames',
                cached: true,
                type: "list" 
            }
        },

        _lib : {
            event_state: ['available', 'closed']
        }
    });
});