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
        helperDirectory: "views/helpers/",

    },

    config: {
        'controllers/Preloader' : {
            requests: [
                {
                    model : 'user',
                    key: 'user:info',
                    cacheKey: 'user',
                },
                {
                    model : 'campus_src',
                    key: 'campus:src:categoryNames',
                    cacheKey : 'srcCategoryNames'
                },
                {
                    model : 'contacts',
                    key: 'contacts:teamCategoryNames',
                    cacheKey : 'teamCategoryNames'
                }
            ]
        }
    }
});

require([
    'app' ,
    'backbone',
    'marionette',
     'controllers/MainController',
     'controllers/LayoutController',
     'controllers/PaceController',
     'controllers/Preloader',
     'models/ModelHelper'
], function (app, Backbone, Marionette, MainController) {
    
    app.on('start',  function () {
        if(Backbone.history){
            Backbone.history.start();
        }
    });

    MainController.init();
    app.start();
});