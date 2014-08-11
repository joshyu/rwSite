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
                        }

                        dfd.resolve({k: req.cacheKey, v: data});
                    });

                    dfds.push(dfd);
                },this));

                app.preloaded= {};               
                $.when.apply($, dfds).done(function (){
                    var _data = [].slice.call(arguments);

                    _.each(_data, function (item) {
                        app.preloaded[item.k] = item.v;
                    });

                    gdfd.resolve(true);

                });

                return gdfd.promise();
            }
        };

        app.addInitializer(function() {
            app.preloader = preloader;
        });

        return preloader;
    }
);