(function() {
    'use strict';

    // Configure RequireJS to shim Jasmine
    require.config({
        baseUrl: '../js/app',
        paths: {
            'jasmine': '../vendor/jasmine-2.0.1/jasmine',
            'jasmine-html': '../vendor/jasmine-2.0.1/jasmine-html',
            'boot': '../vendor/jasmine-2.0.1/boot',
            'tests': '../../tests',
            'specs': '../../tests/specs',

            'underscore': '../vendor/lodash.min',
            'backbone': '../vendor/backbone',
            'marionette': '../vendor/backbone.marionette',
            'jquery': '../vendor/jquery-1.11.1',
            'bootstrap': '../vendor/bootstrap',
            'hbs': "../vendor/hbs",
            'text': "../vendor/text",
            'handlebars': "../vendor/hbs/handlebars",
            'pace': "../vendor/pace",
            'bt3wysihtml5': "../vendor/bootstrap3-wysihtml5.all.min",
            'noty': "../vendor/jquery.noty.packaged.min",
            'zoom': "../vendor/jquery.zoom.min",
            'bootbox': "../vendor/bootbox.min"
        },
        shim: {
            'jasmine': {
                exports: 'jasmine'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            },

            underscore: {
                exports: '_'
            },
            pace: {
                exports: 'Pace'
            },

            backbone: {
                exports: 'Backbone',
                deps: ['jquery', 'underscore']
            },

            bootstrap: {
                deps: ['jquery']
            },

            marionette: {
                exports: 'Backbone.Marionette',
                deps: ['backbone']
            },

            handlebars: {
                "exports": "Handlebars"
            }
        }
    });

    // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
    // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
    // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
    // initialize the HTML Reporter and execute the environment.
    require(['boot'], function() {

        // Load the specs
        require(['specs/_base'], function() {

            // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
            window.onload();
        });
    });
})();