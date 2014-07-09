define(['app','module'],
    function(app,module) {
        var preloader =  {
            init: function (region) {
               var dfds = [], gdfd= $.Deferred(), that = this;

                _.each( module.config().requests , _.bind(function (req,index){
                    var dfd= $.Deferred();
                    var callback = req.callback;
                    $.when(app.modelHelper.get(req.model).request(req.key)).done(function(data){
                        if(typeof callback === 'string' && $.isFunction( that[ callback ] )){
                            data= that[ callback ](data);
                            dfd.resolve(data);
                        }
                    });

                    dfds.push(dfd);
                },this));
               
                $.when.apply($, dfds).done(function (){
                    gdfd.resolve(true);
                });

                return gdfd.promise();
            },

            setUserInfo: function(userdata){
                app.user = userdata;
                return userdata;
            }
        };

        app.addInitializer(function() {
            app.preloader = preloader;
        });

        return preloader;
    }
);