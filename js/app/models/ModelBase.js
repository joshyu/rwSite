define([
    'app',
    'backbone',
    'underscore',
    'models/SPService',
    './SPServiceDefs'
], function(app, Backbone, _, SPService, _SPDefined) {
    'use strict';

    return Backbone.Model.extend({
        initialize: function() {
            var _commands = new Backbone.Wreqr.Commands();
            var _reqres = new Backbone.Wreqr.RequestResponse();
            this.service = SPService.utils.locateService(this);
            this.cached = {};

            this._bindHandlers(this.requests, _reqres, this, '_fetchByType');
            this._bindHandlers(this.commands, _commands, this, '_executeByType');
            this.request = _reqres.request.bind(_reqres);
            this.execute = _commands.execute.bind(_commands);
        },

        requests: null,
        commands: null,
        cached: null,

        _bindHandlers: function(_keys, _cols, context, funcNameByType) {
            var key = null;
            if (!_keys || !_cols || !_cols.setHandler) {
                return false;
            }

            context = context || this;

            for (key in _keys) {
                var _meth = _keys[key];
                if (typeof _meth === 'string' && $.isFunction(context[_meth])) {
                    _cols.setHandler(key, context[_meth], context);
                }

                if (typeof _meth === 'object' && (_meth.url || _meth.deps) && funcNameByType && $.isFunction(context[funcNameByType])) {
                    _meth.context = context;
                    _meth.key = key;
                    _meth = context[funcNameByType](_meth);
                    _cols.setHandler(key, _meth, context);
                }
            }
        },

        _executeByType: function(opts) { /* define */
            return function(args) { /*invoke */
                var type= opts.type;
                if(!(type in _SPDefined.postMethods)){
                    type = 'update';
                }

                opts.serviceKey = opts.url;
                delete opts.url;

                //args : {filters: {}, data: {}}
                var _opts = _.extend({}, opts, args);
                var _meth = this.service[type];
                if(!_meth){
                    _meth = this.service['_postData'];
                }

                return _meth.call(this.service, _opts).then(args.success, args.error);
            };
        },

        _post: function(opts) {
            var data = opts.data || {};

            if (!opts || !opts.url) {
                opts.fail && opts.fail();
                return false;

            } else {
                var options = {
                    url: opts.url,
                    type: 'POST',
                    dataType: 'json',
                    data: data.formData || ''
                };

                Backbone.ajax(options).done(function(status) {
                    if (opts.success) {
                        opts.success(status.status || status);
                    }
                }).fail(function(err) {
                    if (opts.fail) {
                        opts.fail(err);
                    }
                });
            }

            return true;
        },

        _parseDependencies: function(deps) {
            if (!deps) return false;

            if (_.isString(deps)) {
                return this.request(deps);
            }

            if (_.isArray(deps)) {
                if (deps.length == 1) {
                    return this.request(deps[0]);
                }

                var _dfds = [];
                var _dfd = null;
                _.each(deps, _.bind(function(dep, index) {
                    _dfd = null;
                    dep = dep.split("/");
                    if (dep.length == 1) {
                        _dfd = this.request(dep[0]);
                    } else {
                        var _model = app.modelHelper.get(dep[0]);
                        if (_model) {
                            _dfd = _model.request(dep[1]);
                        }
                    }

                    if (_dfd) {
                        _dfds.push(_dfd);
                    }
                }, this));

                return $.when.apply($, _dfds).then(function() {
                    return [].slice.call(arguments);
                });
            }
        },

        _fetchByType: function(opts) {
            var _cached = this.cached;
            var _cachedKey = opts.cached ? opts.key : false;

            return function(args) {
                var dfd = $.Deferred();
                var that = this;
                if (_cachedKey && _cached[_cachedKey]) {
                    dfd.resolve(_.cloneDeep(_cached[_cachedKey]));
                } else {
                    var def = null;
                    if (opts.deps) {
                        def = this._parseDependencies(opts.deps);
                    } else if (opts.url) {
                        var _opts = {
                            serviceKey: opts.url,
                            data: _.extend(opts.data || {}, args),
                            filters: opts.filters
                        };

                        if (opts.listProperties) {
                            _opts.listProperties = opts.listProperties;
                        }

                        if ( opts.returnFields ) {
                            _opts.fields = _.isObject(opts.returnFields) ?  _.keys(opts.returnFields) : opts.returnFields;
                        }

                        def = this.service['_fetch' + (opts.type || 'item')](_opts);
                    }

                    dfd = $.when(def).then(function(data){
                        var _parseData = opts.parseData,
                            _context = opts.context;
                        var options = opts.deps ? args : {};
                        var hasAttachments = false;

                        if (opts.returnFields && _context.filterReturnFields) {
                            hasAttachments = _.isObject(opts.returnFields) && 'AttachmentFiles' in opts.returnFields;
                            data = _context.filterReturnFields(data, opts.returnFields);
                        }

                        //if attachment files are found in returned values, 
                        //then handle the attachments and extract image url.
                        if (hasAttachments && _context.handleAttachments) {
                            if (_.isArray(data)) {
                                data = _.map(data, _context.handleAttachments, _context);
                            } else {
                                data = _context.handleAttachments(data);
                            }
                        }

                        if (_.isFunction(_context[_parseData])) {
                            data = _context[_parseData](data, options);
                        }

                        var _chain = opts.chain;
                        if (_chain && _chain.key) {
                            if (_.isFunction(_chain.data)) {
                                _chain.data = _chain.data(data);
                            }

                            return that.request(_chain.key, _chain.data).then(function(_data) {
                                if (_chain.attrName) {
                                    data[_chain.attrName] = _data;
                                }

                                if (_cachedKey) {
                                    _cached[_cachedKey] = data;
                                }

                                return data;
                            });
                        } else {
                            if (_cachedKey) {
                                _cached[_cachedKey] = data;
                            }
                        }

                        return data;
                    });
                } //end if

                return dfd.promise();
            };
        },

        filterReturnFields: function(data, fields) {
            if (!data || !fields) return data;
            var isItem = false;

            if (!_.isArray(data)) {
                data = [data];
                isItem = true;
            }

            var _item, k;
            data = _.map(data, function(item) {
                _item = {};
                if (_.isString(fields)) {
                    _item = item[fields];
                } else {
                    _.each(fields, function(value, key) {
                        if (!value) return;

                        k = key.indexOf("/");
                        if (k === -1) {
                            _item[value] = item[key];
                        } else {
                            //parse lookup field value.
                            var k1 = key.substr(0,k), k2= key.substr(k+1);
                            var __item = item[k1];

                            if(__item.results && _.isArray(__item.results)){
                                _item[value] = _.map(__item.results, function(iit){
                                    return  iit[k2];
                                });
                            }else{
                                _item[value] = __item[k2];  
                            }
                        }
                    });
                }

                return _item;
            });

            if (data.length == 1 && isItem) {
                data = data[0];
            }
            return data;
        },

        getCached: function(key) {
            return this.cached[key];
        },

        getLibData: function(key) {
            return this._lib && this._lib[key];
        },

        cacheData: function(key, data) {
            this.cached[key] = data;
        },

        //shared methods by the models to handle the attachment list.
        handleAttachments: function(item) {
            var attaches = item.attachments; // item.attachments.results;
            if (attaches) {
                item.attachments = attaches = attaches.results;

                if (attaches.length > 0) {
                    var k = attaches.length,
                        _attach;

                    while (k-- >= 0 && (_attach = attaches[k])) {
                        if (/(jpg|gif|png)$/.test(_attach.FileName)) {
                            item.imageUrl = _attach.ServerRelativeUrl;
                            attaches.splice(k, 1);
                            break;
                        }
                    }
                }

                if (attaches.length === 0) {
                    delete item.attachments;
                }
            }

            return item;
        }
    });
});