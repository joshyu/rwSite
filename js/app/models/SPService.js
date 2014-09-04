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

            //handle the user filter (during search.)
            if (options.data) {
                var _userFilters = options.data.filters;
                if (_userFilters) {
                    if (_userFilters.orderby) {
                        options.queryParameters.orderby = _userFilters.orderby;
                        delete _userFilters.orderby;
                    }

                    var _usrfilter = this.parseUserFilters(_userFilters);
                    if (_usrfilter) {
                        if (!options.queryParameters.filters) {
                            options.queryParameters.filters = _usrfilter;
                        } else {
                            options.queryParameters.filters += " and " + _usrfilter;
                        }
                    }

                    delete options.data.filters;
                }

                if ('num' in options.data) {
                    //try to use sharepoint returned __next value to paginate.
                    var num = Number(options.data.num) || 0;
                    var pageNo = Number(options.data.pageNo) || 0;
                    delete options.data.pageNo;

                    if (pageNo == 0) {
                        options.model.setNextSkipToken(null,false);
                    } else {
                        if (num > 0) {
                            options.queryParameters.skiptoken = options.model.getNextSkipToken();
                        }
                    }
                }
            }

            var  __conf = null;
            if(options.serviceKey && _.isString(options.serviceKey)){
                __conf = this._getServiceConf(_service, options.serviceKey);
            }

            return _.extend({}, __conf , options);
        },

        getListItemType: function(linkname) {
            if(!linkname) return false;

            var another = linkname.slice(1).replace(/_/g, '_x005f_').replace(/\s/g, '_x0020_');
            return "SP.Data." + linkname.charAt(0).toUpperCase() + another + "ListItem";
        },

        getContextInfo: function() {
            if (this.lastContextInfo) {
                return this.lastContextInfo;
            } else {
                return $.ajax({
                    url: _SPDefined.api.contextInfo,
                    method: "POST",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).then(function(data) {
                    return data.d.GetContextWebInformation.FormDigestValue;
                });
            }
        },

        setContextInfo: function(value) {
            this.lastContextInfo = value;
        },

        getPostHeader: function(type) {
            var _headers = {};
            var _meth = _SPDefined.postMethods[type];
            if (_meth) {
                _headers['X-HTTP-Method'] = _meth;
                _headers['If-Match'] = '*';
            }

            return _headers;
        },

        _parseConditionList: function(conds, asList) {
            var condKeyNeedMapped = _SPDefined.conditions.keysNeedMapped;
            var keysItemPermitted = _SPDefined.conditions.keysItemPermitted;

            _.each(conds, function(value, key) {
                var _newKey = condKeyNeedMapped[key];
                if (_newKey) {
                    conds[_newKey] = value;
                    delete conds[key];
                }

                //if the result is not a list, we will remove those forbidden conditions.
                if (!asList && !_.contains(keysItemPermitted, _newKey || key)) {
                    delete conds[key];
                }
            });
        },

        regeneratePOSTUrl: function(options) {
            if (!options || !options.url) return false;
            var url = options.url;
            if (!url) return false;

            if (options.id) {
                var _itemId = options.id;
                delete options.id;
            }

            if (_.isObject(url) && url.site) {
                url = "/" + url.site + _SPDefined.api.listRelativePath.replace('$listTitle$', url.title).replace('$id$', _itemId || "");
            } else if (_.isString(url)) {
                url = url.replace('$id$', _itemId);
            }

            return url;
        },

        regenerateGETUrl: function(options) {
            if (!options || !options.url) return false;
            var url = options.url;
            var urlParams = "";
            if (!url) return false;

            if (options.listProperties) {
                if (_.isObject(url) && url.site) {
                    var params = options.data && options.data.listproperties_parms;
                    var urladded= _.map(params, function(v,k){
                        return "@"+ k +"='" + v + "'";
                    }).join("&") || "";

                    return "/" + url.site + _SPDefined.api.listRelativePathProperties.replace('$listTitle$', url.title).replace('$prop$', options.listProperties) + "?" +  urladded;
                } else {
                    return url + "/" + options.listProperties;
                }
            }

            //parse filter parameter.
            //if the result is item not list, need not filter.
            var _filters = "";
            if (options.asList) {
                _filters = url.filters || "";

                if (options.queryParameters && options.queryParameters.filters) {
                    _filters = (_filters ? (_filters + " and ") : "") + options.queryParameters.filters;
                    delete options.queryParameters.filters;
                }
            }

            if (options.data && options.data.id) {
                var _itemId = options.data.id;
                delete options.data.id;
            }

            var _conditions = _.extend({}, url.conditions, options.data, options.queryParameters);
            this._parseConditionList(_conditions, options.asList);

            if (_.isObject(url) && url.site) {
                url = "/" + url.site + _SPDefined.api.listRelativePath
                                                    .replace('$listTitle$', url.title)
                                                    .replace('$id$', _itemId || "");

                delete _conditions.id;
            } else if (_.isString(url)) {
                url = url.replace('$id$', _itemId);
            }

            if (_filters) {
                urlParams += "$filter=" + _filters + "&";
            }

            if (_conditions.skiptoken) {
                urlParams += encodeURIComponent('$skiptoken') + 
                                "=" + encodeURIComponent(_conditions.skiptoken) + "&";

                delete _conditions.skiptoken;
            }

            urlParams += _.map(_conditions, function(condValue, condKey) {
                return "$" + condKey + "=" + condValue + "&";
            }).join("");

            var _fields = options.fields;
            if (_fields && _fields.length) {
                urlParams += "$select=" + (_.isArray(_fields) ? _fields.join(',') : _fields);
            }

            if (urlParams.length > 0) {
                url += "?";
            }

            return url + urlParams;
        },

        parseUserFilters: function(filterDefs) {
            if (!filterDefs) return false;
            var _filters = [];

            var _keyword = filterDefs.keyword.trim();
            if (_keyword) {
                _filters.push(
                    _.map(_keyword.toLowerCase().split(/\s+/g), function(kw) {
                        return "substringof(\'" + kw + "\',Title)";
                    }).join(" and ")
                );

                delete filterDefs.keyword;
            }

            _.each(filterDefs, function(val, key) {
                if (!val) return;
                _filters.push(key + " eq \'" + val + "\'");
            });

            return _filters.join(" and ");
        }
    };

    var _SPBase = _SPService.base = function(_service) {
        return {
            utils : _SPUtils,
            init: function(options) {
                this.options = options;
            },

            getUrl: function(key){
                var urls = _SPUtils._getServiceConf(_service, key);
                if(!urls) return false;
                return urls.url;
            },

            _fetchlist: function(options) {
                var _model = this.options.model;
                
                return this._fetchitem(options, true).then(function(data) {
                    if (data.__next) {
                        _model.setNextSkipToken(data.__next);
                    }else{
                        _model.setNextSkipToken(null, true);
                    }

                    return data.results;
                });
            },

            _fetchitem: function(options, asList) {
                var url = "";
                options.asList = asList || false;
                _.extend(options, this.options);

                options = _SPUtils.parseOptions(_service, options);
                url = _SPUtils.regenerateGETUrl(options);
                
                if($.active == 0 && !options.noPace){
                    app.pace && app.pace.restart();
                }

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
            },

            _postData: function(options) {
                _.extend(options, this.options);
                options = _SPUtils.parseOptions(_service, options);
                var itemType = _SPUtils.getListItemType(options.listname || options.url.name || options.url.title);
                var url = _SPUtils.regeneratePOSTUrl(options);
                var data = options.data;

                if(itemType){
                    data = _.extend({}, data, {
                        "__metadata": {
                            "type": itemType
                        }
                    });
                }

                return $.when(_SPUtils.getContextInfo()).then(function(reqDigest) {
                    var __header = {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": reqDigest
                    };

                    return $.ajax({
                        url: url,
                        type: "POST",
                        contentType: "application/json;odata=verbose",
                        data: JSON.stringify(data),
                        headers: _.extend(__header, _SPUtils.getPostHeader(options.type))
                    }).then(function(data, txt, xhr) {
                        _SPUtils.setContextInfo(xhr.getResponseHeader('X-RequestDigest'));
                        return data && (data.d || data);
                    });
                });
            }
        };
    };

    return _SPService;
});