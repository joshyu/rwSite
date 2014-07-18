define(['backbone','marionette', 'app', 'pace'],
    function(Backbone, Marionette, app, pace) {
        var paceLib = {
            init: function(){
                var dfd= Backbone.$.Deferred();
                this.instance = pace;

                pace.on('start', function(){
                    dfd.resolve(pace);
                });

                pace.on('hide', function(){
                    app.vent.trigger('app:pace:done');
                });

                //monitor ajax
                $(document).ajaxStart(function() {
                     pace.restart(); 
                 });

                pace.on('restart', function(){
                    $('body').removeClass('pace-done');
                });

                pace.start({restartOnPushState: false});
                return dfd.promise();
            },

            restart: function(){
                 pace.restart();
            }
        };

        app.addInitializer(function() {
             app.pace = paceLib;
        });

        return paceLib;
    }
);