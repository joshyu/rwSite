define([
    'marionette',
    'app',
    'underscore',
], function(Marionette, app, _) {
    'use strict';
    return Marionette.CompositeView.extend({
        renderData: function (data) {
            this.$el.html(this.template(data));
            this.triggerMethod("render", this);
        },

        /* can write your own method to overrid it */
        myTemplData:function  (model) {
            var data= {};
            model = model || this.model;
            if(this.defaults){
                data = this.defaults;
            }else if(model && model.defaults){
                data = model.defaults;
            }
            return  data;
        },

        initialize: function () {
           if(!this.handleRequests()){
                this.renderData(this.myTemplData());
           }
        },
        handleRequests: function () {
            var that= this;
            if(this.request && this.request.key){
                var modelName = this.request.model;
                this.model =  this.model || app.modelHelper.get(modelName);
                var _reqKey = this.request.key;

                var handler = this.request.dataHandler;
                var context = this.request.context || this.model;
                var _reqData = this.request.data || {};

                app.modelHelper.request( _reqKey ).then(function(data){
                    if($.isFunction(handler)){
                        data= handler.call(context, data);
                    }else if(typeof handler === 'string' && $.isFunction(context[handler])){
                        data= context[handler].call(context, data);
                    }

                    var _data= {};
                    _data[modelName] =  _.extend( data , _reqData, that.myTemplData(that.model));
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

                        data= _.extend( data, _reqData,  that.myTemplData( app.modelHelper.get(modelName)  ));
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
        },
       render: function  () {
            return this;
        }
    });
});