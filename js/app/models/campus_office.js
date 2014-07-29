define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'campus:office:layout' : {
                url: "js/data/officelayout.json",
                type: 'list'
            }
        }
    });
});