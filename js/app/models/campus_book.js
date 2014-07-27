define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'campus:book:updates' : {
                url: "js/data/book_updates.json",
                type: "list"
            }
        }
    });
});