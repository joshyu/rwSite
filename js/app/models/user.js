define([
    'app',
    'backbone',
    'models/ModelBase',
], function (app, Backbone, ModelBase) {
    'use strict';

    return ModelBase.extend({
        requests:{
            'user:info' :  {url: 'js/data/user.json', cached: true}
        }
    });
});