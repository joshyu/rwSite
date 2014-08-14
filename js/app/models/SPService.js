define([
    'jquery',
    'underscore',
    './SPServiceDefs'
], function($, _, _SPDefined) {
    'use strict';

    var _SPService = {};
    var _SPUtils = _SPService.utils = {
        locateService: function(model) {
            var service = null;
            var initOpts = {
                model: model
            };
            var _service = '';
            var serviceStmt = model._service || 'base';

            if (serviceStmt) {
                if (_.isString(serviceStmt)) {
                    service = _SPService[serviceStmt];
                    _service = serviceStmt;

                } else if (_.isObject(serviceStmt) && serviceStmt.key) {
                    service = _SPService[serviceStmt.key];
                    _service = serviceStmt.key;
                    initOpts = serviceStmt.options;
                }
            }

            service = _.extend(_SPBase(_service), service);
            service.init(initOpts);

            return service;
        },

        /*
         *  confKey : "SPServiceDef.user.key",
         *  if user is absent, then get the base value
         */
        _getServiceConf: function(_service, confKey) {
            _service = _service || "base";

            if (!confKey) {
                return _SPDefined[_service];
            }

            var _keypairs = confKey.split(".");

            if (_keypairs.length === 1) {
                _keypairs.unshift(_service);
            }

            var _conf = _SPDefined;
            while (_keypairs.length > 0 && _conf) {
                _conf = _conf[_keypairs.shift()];
            }

            return _conf;
        },

        parseOptions: function(_service, options) {
            if (!options) return false;

            if (_.isString(options)) {
                return this._getServiceConf(_service, options);
            } else if (_.isObject(options) && options.serviceKey) {
                return _.extend(this._getServiceConf(_service, options.serviceKey), options);
            }
        },

        _parseConditionList: function(conds) {
            var condKeyNeedMapped = _SPDefined.conditions.keysNeedMapped;
            var compatList = _SPDefined.conditions.KeysWithCompatibilityIssue;
            var useNewAPI = true;
            _.each(conds, function(value, key) {
                var _newKey = condKeyNeedMapped[key];
                if (_newKey) {
                    conds[_newKey] = value;
                    delete conds[key];
                }

                if (_.contains(compatList, _newKey || key)) {
                    useNewAPI = false;
                }
            });

            return useNewAPI;
        },

        regenerateUrl: function(options) {
            if (!options || !options.url) return false;
            var url = options.url;
            var urlParams = "";
            if (!url) return false;

            //parse filter parameter.
            var _filters = url.filters || "";
            if(options.data.filters){
                _filters = (_filters ? (_filters + " and "): "") + options.data.filters;
                delete options.data.filters;
            }


            var _conditions = _.extend({}, url.conditions, options.data);
            var _useNewAPI = this._parseConditionList(_conditions);

            //manually update.
            if (_conditions.inlinecount) {
                _conditions = {
                    top: 0,
                    inlinecount: _conditions.inlinecount
                };
                options.fields = [];
            }

            if (_.isObject(url) && url.site) {
                url.apibase = _useNewAPI ? _SPDefined.api.listRelativePath : _SPDefined.api.listRelativePath_old;
                url = "/" + url.site + url.apibase.replace('$listTitle$', url.title).replace('$id$', _conditions.id || "");
                delete _conditions.id;
            }

            //append the '@' variable pairs.
            urlParams += _.map(url.match(/\@[\w]+/g), function(paramKey) {
                var _key = paramKey.substr(1);
                if (_conditions[_key]) {
                    var _param = paramKey + "=" + _conditions[_key] + "&";
                    delete _conditions[_key];
                }

                return _param || "";
            }).join('');

            if(_filters){
                urlParams += "$filter=" + _filters + "&";
            }

            urlParams += _.map(_conditions, function(condValue, condKey) {
                return "$" + condKey + "=" + condValue + "&";
            }).join("");

            var _fields = options.fields;
            if (_fields && _fields.length) {
                urlParams += "$select=" + _fields.join(',')
            }

            if (urlParams.length > 0) {
                url += "?";
            }

            return url + urlParams;
        }
    };

    var _SPBase = _SPService.base = function(_service) {
        return {
            init: function(options) {
                this.options = _.extend({}, this.options, options);
            },

            _fetchlist: function(options) {
                return this._fetchitem(options).then(function(data) {
                    return data.results;
                });
            },

            _fetchitem: function(options) {
                var url = "";
                options = _SPUtils.parseOptions(_service, options);

                if(options.listProperties){
                    url = "/" + options.url.site + _SPDefined.api.listRelativePathProperties.replace('$listTitle$', options.url.title).replace('$prop$', options.listProperties);
                }else{
                    url = _SPUtils.regenerateUrl(options);    
                }
                
                if (!url) return false;
                return $.ajax({
                    url: url,
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).then(function(data) {
                    data = data.d;
                    if (data.__metadata) {
                        delete data.__metadata;
                    }

                    return data;
                });
            }
        };
    };

    return _SPService;
});