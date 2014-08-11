define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        commands: {
            'suggestion:post' : {
                url: "js/data/postsuccess.jso.aspx"
            }
        }      
    });
});