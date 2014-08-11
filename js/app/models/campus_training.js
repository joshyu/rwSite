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
                url: "js/data/events_training_updates.jso",
                type: 'list'
            },
            'campus:events:training:userowned' : {
                url: "js/data/events_training_updates.jso",
                type: 'list'
            },

            'campus:training:item:info' : {
                url: "js/data/training_item.jso"
            }
        },
        commands: {
            'campus:events:training:markdone' : {
                url: "js/data/postsuccess.jso.aspx"
            },

            'campus:events:training:checktrcode' : {
                url: "js/data/postsuccess.jso.aspx"
            }
        },

        _lib : {
            training_states: ['available', 'closed']
        }
    });
});