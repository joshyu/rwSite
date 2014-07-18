define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'campus:events:src:updates' : {
                url: "js/data/events_src_updates.json",
                type: "list",
                data: {num: 5}
            },
            
             'campus:events:src:userowned' : {
                url: "js/data/events_src_updates.json",
                type: "list"
            },

            'campus:src:item:info' :{
                url: "js/data/src_item.json",
            },

            'campus:src:categoryNames' :{
                url: "js/data/src_categoryNames.json",
                type: "list"
            }
        },

        _lib : {
            event_state: ['Upcoming', 'Outdated']
        }
    });
});