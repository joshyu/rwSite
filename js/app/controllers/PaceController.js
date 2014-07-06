define(['backbone','marionette', 'app', 'pace'],
    function(Backbone, Marionette, app, pace) {
        var paceLib = {
            init: function(){
                var dfd= Backbone.$.Deferred();

                pace.on('start', function(){
                    dfd.resolve(pace);
                });

                pace.on('hide', function(){
                    app.vent.trigger('app:pace:done');
                });

                pace.start({restartOnPushState: false});
                return dfd.promise();
            },

            restart: function () {
                var dfd= Backbone.$.Deferred();

                pace.on('start', function(){
                    dfd.resolve(pace);
                });

                pace.on('hide', function(){
                    app.vent.trigger('app:pace:done');
                });

                pace.start({restartOnPushState: false});
                return dfd.promise();

            }
        };

        app.addInitializer(function() {
             app.pace = paceLib;
        });

        return paceLib;
    }
);