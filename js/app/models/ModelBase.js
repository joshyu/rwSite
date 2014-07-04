define([
    'app',
    'backbone',
    'underscore',
     'models/SPService'
], function (app, Backbone, _, SPService) {
    'use strict';
    
    var _vent = new Backbone.Wreqr.EventAggregator();
    var _commands = new Backbone.Wreqr.Commands();
    var _reqres = new Backbone.Wreqr.RequestResponse();

    return Backbone.Model.extend({
        initialize: function () {
              this._bindHandlers(this.requests, _reqres, this);
              this._bindHandlers(this.commands, _commands, this);
              this.request =_reqres.request.bind(_reqres);
              this.execute =_commands.execute.bind(_commands);
              //this.service = SPService.
        },

        requests: {},
        commands : {},

        _bindHandlers: function(_keys, _cols, context){
            if(!_keys || !_cols || !_cols.setHandler){
                return false;
            }

            context= context || this;

            for(var key in _keys){
                var _meth= _keys[key];
                if( typeof _meth == 'string' && $.isFunction(context[_meth])){
                    _cols.setHandler( key, _meth, context);
                }

                if(typeof _meth == 'object' && _meth.url){
                    _meth.context = context;
                    _meth = context['_fetchByType'](_meth);

                    _cols.setHandler( key, _meth, context);
                }                
            }
        }, 

        _fetchByType: function(opts){
            return function(args){
                return this['_fetch' + (opts.type || 'item')]({
                    url: opts.url,
                    data: _.extend(opts.data, args),
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