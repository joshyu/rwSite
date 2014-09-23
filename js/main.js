require.config({
    baseUrl: 'js/app',
    paths: {
        underscore: '../vendor/lodash.min',
        backbone: '../vendor/backbone-min',
        marionette: '../vendor/backbone.marionette.min',
        jquery: '../vendor/jquery.min',
        bootstrap: '../vendor/bootstrap.min',
        hbs: "../vendor/hbs",
        text: "../vendor/text",
        handlebars:"../vendor/hbs/handlebars",
        pace: "../vendor/pace.min",
        bt3wysihtml5: "../vendor/bootstrap3-wysihtml5.all.min",
        noty: "../vendor/jquery.noty.packaged.min",
        zoom: "../vendor/jquery.zoom.min",
        bootbox: "../vendor/bootbox.min"
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
                    key: 'user:all:related',
                    cacheKey: 'user',
                    job: 'syncUserRelatedData',
                    jobDelay: '5000'
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
        },

        'controllers/MainController' : {
            pluginBasePath : 'views/plugins',
            plugins : [ 'lync' ]
        },
        
        'models/user' : {
            sysmails: {
                'SHAREPOINT\\system' : 'bdong@ra.rockwell.com'
            },

            admin_mail: 'bdong@ra.rockwell.com'  //in order not to display error, show the mail address of farm administrator.
        }
    }
});

require([
    'app' ,
    'backbone',
    'marionette',
     'controllers/MainController',
     'controllers/PaceController',
     'models/ModelHelper',
     'controllers/JobHelper',     
     'controllers/Preloader',
     'controllers/LayoutController'     
], function (app, Backbone, Marionette, MainController) {
    
    app.on('start',  function () {
        if(Backbone.history){
            Backbone.history.start();
        }
    });

    MainController.init();
    app.start();
});