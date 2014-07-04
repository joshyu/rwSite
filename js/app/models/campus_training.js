define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        defaults: {
            title: 'Training Center',
        },
        requests: {
            'campus:events:training:updates' : {
                url: "js/data/events_training_updates.json",
                type: 'list'
            },
            'campus:training:item:info' : {
                url: "js/data/training_item.json"
            }
        }
    });
});