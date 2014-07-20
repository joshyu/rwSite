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
                    if(! $('body').hasClass('loaded')){
                        $('body').addClass('loaded');    
                    }
                                        
                    app.vent.trigger('app:pace:done');
                });

                //monitor ajax
                $(document).ajaxStart(function() {
                     pace.restart(); 
                 });

                pace.start({restartOnPushState: false});
                return dfd.promise();
            },

            restart: function(){
                if(!pace.running){
                    pace.restart();
                }
            }
        };

        app.addInitializer(function() {
             app.pace = paceLib;
        });

        return paceLib;
    }
);