define([
    'app',
    'jquery',
    'underscore'
], function(app, $, _) {
    'use strict';

    var Jobs = {};
    Jobs.base = {
        duration: 1000,
        bind: function(factory,jobId){
            this.factory = factory;
            this.jobId = jobId;
            this._pool = this._pool ||  factory.getJobPool(jobId);
        },

        //return new derived module.
        extend: function(options){
            var newCls =  _.extend({}, this, options);
            newCls._super = this;
            return newCls;
        },

        byNamespace: function(namespace){
            this.namespace= namespace || this.namespace;
            return this;
        },

        run: function(manual){
            var canRun= false;
            if(manual){
                canRun = this._pool.length > 0;
            }else{
                canRun = this._pool.length > 0 && this.duration !== false && this.shouldRun();
            }
            //var canRun= manual || this.duration !== false;
            if( !canRun ) return;
            this.lastScan =  this.nextScan || Number(new Date());
            this.nextScan = this.lastScan + this.duration;
            this.runjob( manual );
        },

        trigger: function(delay){
            _.delay(_.bind(this.run, this, true), Number(delay) || 0);
        },

        runjob: function(){},
        register: function(data, callbacks){
            var _namespace = data.namespace ||  this.namespace || "";

            this._pool.push({
                namespace: _namespace,
                data: data || {},
                callbacks: callbacks || {}
            });

            return this;
        },

        clear: function(namespace){
            var cleared= false;
            namespace = namespace || this.namespace;

            if(namespace){
                var _pool = _.reject(this._pool, function(item){
                    return item.namespace == namespace;
                });

                if(_pool.length ===0){
                    this.reset();
                    cleared = true;
                }else{
                    this._pool.length = 0;
                    _.extend(this._pool, _pool);
                }
            }else{
                this.reset();
                cleared = true;
            }

            return cleared;
        },

        reset: function(){
            this._pool.length = 0;
            this._pool = null;
            this.namespace = '';
            this.lastScan = null;
            this.nextScan = null;
        },

        shouldRun: function(){
            var now = Number(new Date());
            if(!this.nextScan){
                this.nextScan = now;
            }

            return (this.nextScan <= now);   //&& (this.nextScan + this.duration >  now)
        }
    };

    Jobs.dbRequestJob = Jobs.base.extend({
        duration: 10000,
        namespace: 'dbRequestJob',
        prepareDB: function(options){
            this.modelId = options.modelId;
            this.dbMethod = options.dbMethod;
            this.dbReqKey = options.dbReqKey;
        },

        getReqParameter: function(item){ return; },
        runjob: function( manual ){
            var that = this;

            //debug info.
            console.log("runJob ["+ that.jobId +"] on:" + (new Date()).toLocaleString());

            _.each(that._pool, function(item){
                //console.log(manual, namespace);
                //debugger;
                if(manual && that.namespace !== item.namespace) return;

                var onStart = item.callbacks.onTimerStart || that.onTimerStart;
                var _data = item.data;
                if(onStart){
                    onStart(_data);
                }

                var parms = that.getReqParameter(_data);
                var modelId = _data.modelId || that.modelId;
                var dbMethod = _data.dbMethod || that.dbMethod;
                var dbReqKey = _data.dbReqKey || that.dbReqKey;
                var dbreq= null;

                if(modelId){
                    dbreq = app.modelHelper.get(modelId);
                }

                if(dbMethod){
                    dbreq = dbreq[dbMethod](parms);
                }else if(dbReqKey){
                    dbreq = dbreq.request(dbReqKey, parms);
                }

                $.when( dbreq ).then(function(){
                    var context =null;
                    var onEnd = item.callbacks.onTimerEnd;
                    if(!onEnd){
                        onEnd = that.onTimerEnd;
                        context = that;
                    }

                    var data = [].slice.call(arguments);
                    onEnd.call(context, data, _data);
                }, function(){
                    var context =null;
                    var onError = item.callbacks.onTimerError;
                    if(!onError){
                        onError = that.onTimerError;
                        context = that;
                    }

                    var data = [].slice.call(arguments);
                    onError && onError.call(context, data, _data);
                });
            });
        }
    });

    Jobs.requestJoinNum = Jobs.dbRequestJob.extend({
        dbMethod: 'requestJoinNum',
        namespace: 'requestJoinNum',
        getReqParameter: function(item){
            return item.title; 
        },

        //hardcoded callback when timer end. 
        //here we update the join number with the new one.
        //data: the result set from db
        //item: the def of the running job item.
        onTimerEnd: function(data, item, error){
            if(!item.dom) return false;
            var $dom = item.dom && $(item.dom);
            var newNum = data[0];
            var numNow = false;

            if($dom.find('img').length == 0){
                numNow = Number($dom.text());
            }

            if(numNow !== newNum){
                $dom.fadeOut(function(){
                    $dom.html(newNum);
                    if(error){
                        if(!$dom.hasClass('label-danger')){
                            $dom.addClass('label-danger').attr('title', 'list not found');
                        }
                    }else{
                        if(!$dom.hasClass('label-primary')){
                            $dom.addClass('label-primary');
                        }    
                    }
                    

                    $dom.fadeIn('slow');
                });
            }
        },

        onTimerError: function(data, item){
            this.onTimerEnd([0], item,true);
        }
    });

    Jobs.syncUserRelatedData = Jobs.dbRequestJob.extend({
        duration: 20000,
        namespace: 'syncUserRelatedData',
        onTimerEnd: function(data, item){
            var _data = data[0];
            var datacallback = item.DataCallback;
            var context = item.context;

            if(typeof datacallback === 'string' && context && $.isFunction( context[ datacallback ] )){
                _data= context[ datacallback ](_data);
            }

            //this.triggerChanges(_data, app.preloaded[ item.cacheKey ]);
            app.preloaded[ item.cacheKey ] = _data;
        },

        _dirtyCheckList: [],
        registerChangeTrigger: function(checker, callback,context){
            if(checker && callback && _.isFunction(checker) && _.isFunction(callback)){
                this._dirtyCheckList.push({
                    checker: checker,
                    callback: callback,
                    context: context
                });       
            }            
        },

        triggerChanges: function(data, prevData){
            _.each(this._dirtyCheckList, function(triggerDef){
                if(triggerDef.checker.call(triggerDef.context, data, prevData)){
                    triggerDef.callback.call(triggerDef.context, data);
                }
            },this);
        }
    });


    var jobPool= {
        _jobpool: {},
        duration: 2000,
        init: function(){
            this.started= false; 
            return this;
        },

        startTimer: function(){
            if(!this.started){
                this.started = true;
                this.timer();                
            }            
        },

        clearTimer: function(namespace){
            if(this.started){
                var allcleared = true;
                _.each(this._jobpool, function(pool,job){
                    if(!this.get(job).clear(namespace)){
                        allcleared = false;
                    }
                }, this);

                if( allcleared ){
                    this._jobpool = {};
                    this.started = false;
                    clearTimeout(this.timed);
                    this.timed = null;   
                }
            }
        },

        timer: function(){
            if(!this.started) return false;

            _.each(this._jobpool, function(pool, job){
                this.get(job).run();
            }, this);

            var timerFunc = _.bind(this.timer, this);
            if(this.duration !== false){
                this.timed= setTimeout(timerFunc, this.duration);    
            }            
        },

        get: function(jobId, namespace){
            var _job = Jobs[jobId] || Jobs.base;
            _job.bind(this, jobId);
            
            this.startTimer();
            if(namespace){
                _job.byNamespace(namespace);
            }

            return _job;
        },

        getJobPool: function(jobId){
            return this._jobpool[jobId] = this._jobpool[jobId] || [];
        }        
    };

    app.addInitializer(function() {
        app.jobHelper = jobPool.init();
    });
});