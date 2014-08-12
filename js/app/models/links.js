define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
         _service: 'qlinks',
        requests:{
            'links:quicklinks' : {
                url: "items",
                type: 'list',
                returnFields: {
                    'Id': 'id',
                    'LinkUrl': 'link',
                    'Title': 'title'
                }
            }
        }        
    });
});