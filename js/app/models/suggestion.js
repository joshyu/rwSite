define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'suggestion',
        commands: {
            'suggestion:post' : {
                url: 'items',
                type: 'create'
            }
        }      
    });
});