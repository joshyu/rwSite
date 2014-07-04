require.config({
    baseUrl: 'js/app',
    paths: {
        underscore: '../vendor/lodash.min',
        backbone: '../vendor/backbone',
        marionette: '../vendor/backbone.marionette',
        jquery: '../vendor/jquery.min',
        bootstrap: '../vendor/bootstrap',
        hbs: "../vendor/hbs",
        text: "../vendor/text",
        handlebars:"../vendor/hbs/handlebars",
        pace: "../vendor/pace.min",
        bt3wysihtml5: "../vendor/bootstrap3-wysihtml5.all.min",
    },

    shim: {
        underscore: {
            exports: '_'
        },
        pace:{
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

        handlebars:{
            "exports":"Handlebars"
        }
    },

    hbs:{
        helpers: true,
        i18n: false,
        templateExtension: 'html',
        helperDirectory: "templates/helpers/",

    }
});

require([
    'app' ,
     'controllers/LayoutController',
     'controllers/PaceController',
     'models/ModelHelper'
], function (app) {
       app.start();
});