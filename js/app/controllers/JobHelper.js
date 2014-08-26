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

        run: function(){
            if(!this.shouldRun() || this._pool.length === 0) return;
            this.lastScan =  this.nextScan || Number(new Date());
            this.nextScan = this.lastScan + this.duration;
            this.runjob();
        },

        trigger: function(delay){
            _.delay(_.bind(this.run, this), Number(delay) || 0);
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
        duration: 20000,
        namespace: 'dbRequestJob',
        prepareDB: function(options){
            this.modelId = options.modelId;
            this.dbMethod = options.dbMethod;
            this.dbReqKey = options.dbReqKey;
        },

        getReqParameter: function(item){ return; },
        runjob: function(){
            var that = this;

            //debug info.
            console.log("runJob ["+ that.jobId +"] on:" + (new Date()).toLocaleString());

            _.each(that._pool, function(item){
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

                $.when( dbreq ).done(function(){
                    var onEnd = item.callbacks.onTimerEnd || that.onTimerEnd;
                    var data = [].slice.call(arguments);
                    onEnd(data, _data);
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
        onTimerEnd: function(data, item){
            if(!item.dom) return false;
            var $dom = item.dom && $(item.dom);
            var newNum = data[0];

            var numNow = Number($dom.text());
            if(numNow !== newNum){
                $dom.fadeOut(function(){
                    $dom.html(newNum);
                    if(!$dom.hasClass('label-primary')){
                        $dom.addClass('label-primary');
                    }

                    $dom.fadeIn('slow');
                });
            }
        }
    });

    Jobs.syncUserRelatedData = Jobs.dbRequestJob.extend({
        duration: 40000,
        namespace: 'syncUserRelatedData',
        onTimerEnd: function(data, item){
            var _data = data[0];
            var datacallback = item.DataCallback;
            var context = item.context;

            if(typeof datacallback === 'string' && context && $.isFunction( context[ datacallback ] )){
                _data= context[ datacallback ](_data);
                app.preloaded[ item.cacheKey ] = _data;
            }

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
            this.timed= setTimeout(timerFunc, this.duration);
        },

        get: function(jobId, namespace){
            var _job = Jobs[jobId] || Jobs.base;
            _job.bind(this, jobId);
            
            this.startTimer();
            return _job.byNamespace(namespace);
        },

        getJobPool: function(jobId){
            return this._jobpool[jobId] = this._jobpool[jobId] || [];
        }        
    };

    app.addInitializer(function() {
        app.jobHelper = jobPool.init();
    });
});