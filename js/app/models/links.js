define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests:{
            'links:quicklinks' : {
                url: "js/data/qlinks.json",
                type: 'list'
            }
        }        
    });
});