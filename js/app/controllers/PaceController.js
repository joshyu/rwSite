define(['backbone','marionette', 'app', 'pace'],
    function(Backbone, Marionette, app, pace) {
        var paceLib = {
            init: function(){
                var dfd= Backbone.$.Deferred();
                this.instance = pace;

                pace.once('start', function(){
                    dfd.resolve(pace);
                });

                pace.on('hide', function(){
                    if(! $('body').hasClass('loaded')){
                        $('body').addClass('loaded');    
                    }
                                      
                    app.vent.trigger('app:pace:done');
                });

                //var ignoreURLs = [ /regcenter.*ItemCount/i ];
                app.vent.on('pace:restart', function(url){
                    if(!url) return false;
                    var ignore = false;

                    /*_.each(ignoreURLs, function(pattern){
                        ignore = (_.isString(pattern) && url.indexOf(pattern) !== -1) || 
                                    (_.isRegExp(pattern) && pattern.test(url));

                        if(ignore) return false;
                    });*/

                    if(!ignore && !pace.running){
                        pace.restart();
                    }
                });

                pace.start({
                    restartOnPushState: false,
                    restartOnRequestAfter: false,
                    /*ajax: {
                        ignoreURLs: [ /regcenter.*ItemCount/i ]
                    }*/
                 });
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