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
                //url: "js/data/postsuccess.jso.aspx"
                url: 'items',
                type: 'create'
            }
        }      
    });
});