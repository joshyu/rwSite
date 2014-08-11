define(['backbone','marionette', 'app', 'pace'],
    function(Backbone, Marionette, app, pace) {
        var paceLib = {
            init: function(){
                var dfd= Backbone.$.Deferred();
                this.instance = pace;

                pace.on('start', function(){
                    dfd.resolve(pace);
                      pace.off('start', arguments.callee);
                });

                pace.on('hide', function(){
                    if(! $('body').hasClass('loaded')){
                        $('body').addClass('loaded');    
                    }

                    pace.off('hide', arguments.callee);                                        
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