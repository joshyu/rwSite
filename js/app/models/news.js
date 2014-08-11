define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'campus:news:list' : {
                type: "list",
                url: "js/data/news.jso"
            }
        }      
    });
});