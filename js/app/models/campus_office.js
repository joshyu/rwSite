define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function(app, Backbone, _, ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'office',
        requests: {
            'campus:office:layout': {
                url:"layout",
                type: 'list',
                returnFields:{
                    "Id": "id",
                    "Title": "title",
                    "File/ServerRelativeUrl":"image"
                },
                queryParameters: {
                    expand: 'File'
                }
            },

            'campus:project:list': {
                url: "products",
                type: 'list',
                returnFields:{
                    "Id": "id",
                    "Title": "title",
                    "Description": "description",
                    "File/ServerRelativeUrl":"image"
                },
                queryParameters: {
                    expand: 'File'
                }
            }

        }
    });
});