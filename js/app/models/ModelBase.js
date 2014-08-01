define([
    'app',
    'backbone',
    'underscore',
     'models/SPService'
], function (app, Backbone, _, SPService) {
    'use strict';
    
    return Backbone.Model.extend({
        initialize: function () {
            var _commands = new Backbone.Wreqr.Commands();
            var _reqres = new Backbone.Wreqr.RequestResponse();

            this._bindHandlers(this.requests, _reqres, this, '_fetchByType');
            this._bindHandlers(this.commands, _commands, this, '_executeByType');
            this.request =_reqres.request.bind(_reqres);
            this.execute =_commands.execute.bind(_commands);
        },

        requests: {},
        commands : {},
        cached: {},

        _bindHandlers: function(_keys, _cols, context, funcNameByType){
            var key = null;
            if(!_keys || !_cols || !_cols.setHandler){
                return false;
            }

            context= context || this;

            for(key in _keys){
                var _meth= _keys[key];
                if( typeof _meth === 'string' && $.isFunction(context[_meth])){
                    _cols.setHandler( key, context[_meth], context);
                }

                if(typeof _meth === 'object' && (_meth.url || _meth.dep ) && funcNameByType && $.isFunction(context[funcNameByType])){
                    _meth.context = context;
                    _meth.key = key;
                    _meth = context[ funcNameByType ](_meth);

                    _cols.setHandler( key, _meth, context);
                }                
            }
        }, 

        _executeByType: function (opts) {  /* define */
            return function (args) { /*invoke */
                return this['_post']({
                    url: opts.url,
                    data: _.extend(opts.data || {}, args.data),
                    success: args.success,
                    fail : args.fail,
                });
            };
        },

        _post: function (opts) {
            var data= opts.data || {};

            if(!opts || !opts.url){
                opts.fail && opts.fail();
                return false;
            
            }else{
                var options= {
                    url: opts.url,
                    type: 'POST',
                    dataType: 'json',
                    data: data.formData || ''
                };

                Backbone.ajax(options).done(function (status) {
                    if(opts.success){
                        opts.success(status.status || status);
                    }
                }).fail(function (err) {
                    if(opts.fail){
                        opts.fail(err);
                    }
                });
            }

            return true;
        },

        _fetchByType: function(opts){
            var _cached = this.cached;
            var _cachedKey= opts.cached ? opts.key : false;

            return function(args){
                var dfd= $.Deferred();
                if(_cachedKey && _cached[_cachedKey]){
                    dfd.resolve(_.clone(_cached[_cachedKey]));
                }else{
                    var def = null;
                    if(opts.dep){
                        def = this.request(opts.dep);
                    }else if(opts.url){
                        def = this['_fetch' + (opts.type || 'item')]({
                            url: opts.url,
                            data: _.extend(opts.data || {}, args)
                        });
                    }

                    def.then(function(data){
                        var _parseData = opts.parseData,
                             _context= opts.context;
                        var options = opts.dep ? args : {};

                        if(_.isFunction(_context[_parseData])){
                            data = _context[_parseData](data, options);
                        }

                        if(_cachedKey){
                            _cached[_cachedKey] = data;
                        }

                        dfd.resolve(data);
                    });
                
                } //end if

                return dfd.promise();                
            };
        },

        _fetchitem: function (opts){
            var dfd= $.Deferred();

            if(!opts || !opts.url){
                dfd.reject(false);
            }else{
                var options= {
                    url: opts.url,
                    type: 'GET',
                    dataType: 'json',
                    data: opts.data,
                    success: function(data){
                        dfd.resolve(data);
                    }
                };

                Backbone.ajax(options);
            }

            return dfd.promise();
        },

        _fetchlist: function(opts){
            var dfd= $.Deferred();

            if(!opts || !opts.url){
                dfd.reject(false);
            }else{
                var options= {
                    url: opts.url,
                    type: 'GET',
                    dataType: 'json',
                    data: opts.data,
                    success: function(data){
                        dfd.resolve(data.data);
                    }
                };

                Backbone.ajax(options);
            }

            return dfd.promise();
        },

        getCached: function(key){
            return this.cached[key];
        },

        getLibData: function(key){
            return this._lib && this._lib[key];
        },

        cacheData: function(key, data){
            this.cached[key] = data;
        }
    });
});