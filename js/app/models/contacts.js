define([
    'app',
    'backbone',
    'models/ModelBase'
], function (app, Backbone, ModelBase) {
    'use strict';
    return ModelBase.extend({
        requests: {
            'contacts:contactInfo' : {
                url: 'js/data/contact.json'
            },

            'contacts:newhire' : {
                url: 'js/data/contact_newhire.json',
                type: 'list'
            },

            'contacts:birthday:recently' : {
                url: 'js/data/contact_birthday.json',
                type: 'list'
            }
        }
    });
});