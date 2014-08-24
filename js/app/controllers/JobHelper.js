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
            this._pool = this._pool ||  factory.getJobPool(jobId);
        },

        byNamespace: function(namespace){
            this.namespace= namespace;
            return this;
        },

        run: function(){
            if(!this.shouldRun() || this._pool.length === 0) return;
            this.lastScan =  this.nextScan || Number(new Date());
            this.nextScan = this.lastScan + this.duration;
            this.runjob();
        },

        trigger: function(){
            this.run();
        },

        runjob: function(){},
        register: function(dom, data, callbacks){
            var _namespace = this.namespace || "";

            this._pool.push({
                namespace: _namespace,
                dom: dom,
                data: data,
                callbacks: callbacks || {}
            });
        },

        clear: function(namespace){
            var cleared= false;
            if(namespace){
                this._pool = _.reject(this._pool, function(item){
                    return item.namespace == namespace;
                });

                if(this._pool.length ===0){
                    this.reset();
                    cleared = true;
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

    Jobs.requestJoinNum = _.extend(Jobs.base, {
        duration: 10000,
        runjob: function(){
            var that = this;
            _.each(this._pool, function(item){
                if(item.callbacks.onTimerStart){
                    item.callbacks.onTimerStart(item.dom);
                }

                $.when(app.modelHelper.get(item.data.modelId).requestJoinNum(item.data.title)).done(function(num){
                    var onEnd = item.callbacks.onTimerEnd || that.onTimerEnd;
                    onEnd(item.dom, {num: num});
                });
            });            
        },

        onTimerEnd: function(dom, data){
            var numNow = Number($(dom).text());
            if(numNow !== data.num){
                $(dom).fadeOut(function(){
                    $(dom).html(data.num);
                    if(!$(dom).hasClass('label-primary')){
                        $(dom).addClass('label-primary');
                    }

                    $(dom).fadeIn('slow');
                });
            }
        }
    });


    var jobFactory= {
        _jobpool: {},
        duration: 1000,
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
        app.jobHelper = jobFactory.init();
    });
});