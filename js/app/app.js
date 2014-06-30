define(['jquery', 'backbone', 'marionette', 'underscore' ],
    function($, Backbone, Marionette, _) {
        var app = new Marionette.Application();
         window.app = app;
         
         app.addInitializer(function() {
            /*Backbone.history.start();*/

        });

        return app;
    }
);