define([
    'app',
    'backbone',
    'underscore',
     'models/SPService'
], function (app, Backbone, _, SPService) {
    'use strict';
    
    return Backbone.Model.extend({
        initialize: function () {
            var _vent = new Backbone.Wreqr.EventAggregator();
            var _commands = new Backbone.Wreqr.Commands();
            var _reqres = new Backbone.Wreqr.RequestResponse();


            this._bindHandlers(this.requests, _reqres, this, '_fetchByType');
            this._bindHandlers(this.commands, _commands, this, '_executeByType');
            this.request =_reqres.request.bind(_reqres);
            this.execute =_commands.execute.bind(_commands);
            //this.service = SPService.
        },

        requests: {},
        commands : {},

        _bindHandlers: function(_keys, _cols, context, funcNameByType){
            if(!_keys || !_cols || !_cols.setHandler){
                return false;
            }

            context= context || this;

            for(var key in _keys){
                var _meth= _keys[key];
                if( typeof _meth == 'string' && $.isFunction(context[_meth])){
                    _cols.setHandler( key, context[_meth], context);
                }

                if(typeof _meth == 'object' && _meth.url && funcNameByType && $.isFunction(context[funcNameByType])){
                    _meth.context = context;
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
            }
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
                    contentType: "application/json;odata=verbose",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                    dataType: 'json',
                    data: data.formData || ''
                };

                Backbone.ajax(options).done(function (status) {
                    var status = data.status || data;
                    if(opts.success){
                        opts.success(status);
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
            return function(args){
                return this['_fetch' + (opts.type || 'item')]({
                    url: opts.url,
                    data: _.extend(opts.data || {}, args.data),
                    cached: opts.cached
                }).then(function(data){
                    var _parseData = opts.parseData,
                         _context= opts.context;

                    if(_.isFunction(_context[_parseData])){
                        return _context[_parseData](data);
                    }else{
                        return data;
                    }
                });
            }
        },

        _fetchitem: function _func(opts){
            var dfd= $.Deferred();
            if(!opts || !opts.url){
                dfd.reject(false);
            }else{
                if(opts.cached && _func.cached){
                    dfd.resolve(_func.cached);
                }else{
                    var options= {
                        url: opts.url,
                        type: 'GET',
                        dataType: 'json',
                        data: opts.data,
                        success: function(data){
                            if(opts.cached){
                                _func.cached = data;
                            }

                            dfd.resolve(data);
                        }
                    };

                    Backbone.ajax(options);
                }                 
            }

            return dfd.promise();
        },

        _fetchlist: function _func(opts){
            var dfd= $.Deferred();
            if(!opts || !opts.url){
                dfd.reject(false);
            }else{
                if(opts.cached && _func.cached){
                    dfd.resolve(_func.cached);
                }else{
                    var options= {
                        url: opts.url,
                        type: 'GET',
                        dataType: 'json',
                        data: opts.data,
                        success: function(data){
                            data = data.data;
                            if(opts.cached){
                                _func.cached = data;
                            }

                            dfd.resolve(data);
                        }
                    };

                    Backbone.ajax(options);
                }                 
            }

            return dfd.promise();
        }

    });
});