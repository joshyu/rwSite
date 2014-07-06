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
        pace: "../vendor/pace",
        bt3wysihtml5: "../vendor/bootstrap3-wysihtml5.all.min",
        noty: "../vendor/jquery.noty.packaged.min"
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
     'controllers/MainController',
     'controllers/LayoutController',
     'controllers/PaceController',
     'models/ModelHelper'
], function (app, MainController) {
    
    app.on('start',  function () {
        if(Backbone.history){
            Backbone.history.start();
        }
    });

    app.router = new Marionette.AppRouter({
        controller : MainController,
        appRoutes  : MainController.routes
    });

    app.start();
});