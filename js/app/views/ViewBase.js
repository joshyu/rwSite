define([
    'marionette',
    'app',
    'underscore',
], function(Marionette, app, _) {
    'use strict';
    return Marionette.CompositeView.extend({
        renderData: function (data) {
            data = _.extend(this.myTemplData(), data);
            this.$el.html(this.template(data));
            this.triggerMethod("render", this);
        },

        /* can write your own method to overrid it */
        myTemplData:function  () {
            var data= {};
            if(this.templateData){
                data = this.templateData;
            }
            
            return  data;
        },

        initialize: function () {
           if(!this.handleRequests()){
                this.renderData();
           }
        },
        handleRequests: function () {
            var that= this;
            if(this.request && this.request.key){
                var modelName = this.request.model;
                this.model =  this.model || app.modelHelper.get(modelName);
                var _reqKey = this.request.key;

                var handler = this.request.dataHandler;
                var _reqData = this.request.data || {};
                var options = this.request.options;
                var reqOptFunc= this.request.getOptions;
                if(!options && reqOptFunc){
                    if(_.isFunction(reqOptFunc)){
                        options =reqOptFunc.call(this);    
                    }else if(_.isString(reqOptFunc) && _.isFunction(this[reqOptFunc])){
                        options = this[reqOptFunc].call(this);
                    }                    
                }

                app.modelHelper.request( _reqKey, options|| {}).then(function(data){
                    if($.isFunction(handler)){
                        data= handler.call(that.model, data);
                    }else if(typeof handler === 'string' && $.isFunction(that.model[handler])){
                        data= that.model[handler].call(that.model, data);
                    }

                    var _data= {};
                    _data[modelName] =  _.extend(data, _reqData);
                    return that.renderData(_data);
                });
            }else if(this.requests && this.requests.length){
                var _model = null;
                var _dfds= [];
                _.each(this.requests, function (request){
                    var modelName = request.model;
                    _model =  app.modelHelper.get(modelName);
                    var _reqKey = request.key;
                    var dfd= $.Deferred();

                    var handler = request.dataHandler;
                    var context = request.context || _model;                    
                    var _reqData = request.data || {};

                    app.modelHelper.request( _reqKey ).then(function(data){
                        if($.isFunction(handler)){
                            data= handler.call(context, data);
                        }else if(typeof handler === 'string' && $.isFunction(context[handler])){
                            data= context[handler].call(context, data);
                        }

                        data= _.extend(data, _reqData);
                        var _id = request.id ? (modelName + '-'+ request.id) : modelName;
                        dfd.resolve({id: _id , data: data});
                    });

                    _dfds.push(dfd);
                });

                $.when.apply($, _dfds).done(function (){
                    var data= {};
                    _.each(arguments, function(_data){
                        data[_data.id] = _data.data;
                    });

                    that.renderData(data);
                });
            }else{
                return false;
            }

            return true;
        },
       render: function  () {
            return this;
        }
    });
});