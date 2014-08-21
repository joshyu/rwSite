define([
    'marionette',
    'app',
    'underscore',
], function(Marionette, app, _) {
    'use strict';
    return Marionette.CompositeView.extend({
        renderData: function (data) {
            this._renderData(data);
        },

        _renderData: function(data){
            if(!this._templateData){
                this._templateData= data;
            }
            
            data = _.extend(this.myTemplData(), data);
            this._renderHTML(this.template(data));
        },

        _renderHTML: function(html){
            this.triggerMethod('before:render', this);            
            this.$el.html(html || "");
            this.triggerMethod("render", this);
        },

        myTemplData:function  () {
            var data= {};
            if(this.templateData){
                data = this.templateData;
            }

            if(this.getTemplateData && _.isFunction(this.getTemplateData)){
                 data = _.extend(data, this.getTemplateData());
            }
            
            return  data;
        },

        bindEvents: function(){ return; },
        bindDomEvents: function(){return;},
        initialize: function () {
            this.bindEvents();
           if(!this.handleRequests()){
                this.renderData();
           }
        },

        handleRequests: function(){
            var reqs= this.requests;
            if(!reqs || !reqs.length){
                if(!this.request || !this.request.key){
                    return false;
                }

                reqs = [ this.request ];
            }

            var _dfds= [];
            var that = this;
            _.each(reqs, _.bind(function (request,index){
                var modelName = request.model;
                var _model =  app.modelHelper.get(modelName);
                that.bindDomEvents(modelName, _model);    

                var _reqKey = request.key;
                var dfd= $.Deferred();

                var handler = request.dataHandler;                  
                var options = request.options;
                var reqOptFunc = request.getOptions;
                
                if(!options && reqOptFunc){
                    if(_.isFunction(reqOptFunc)){
                        options =reqOptFunc.call(this);    
                    }else if(_.isString(reqOptFunc) && _.isFunction(this[reqOptFunc])){
                        options = this[reqOptFunc].call(this);
                    }                    
                }

                options = options || {};
                if(request.returnFields){
                    options.returnFields = request.returnFields;    
                }

                $.when(_model.request( _reqKey, options)).done(function(data){
                    if($.isFunction(handler)){
                        data= handler.call(_model, data, options);
                    }else if(typeof handler === 'string' && $.isFunction(_model[handler])){
                        data= _model[handler].call(_model, data, options);
                    }

                    var _id = request.id ? (modelName + '-'+ request.id) : modelName;
                    dfd.resolve({id: _id , data: data});
                });

                _dfds.push(dfd);

            },this));

            $.when.apply($, _dfds).done(function (){
                var data= {};
                _.each(arguments, function(_data){
                    var _key= _data.id;
                    if(!data[_key]){
                        data[_key] = _data.data;
                    }else if(_.isArray(data[_key])){
                        data[_key].push(_data.data);
                    }else{
                        data[_key] = [data[_key], _data.data];
                    }
                });

                that.renderData(data);
            });

            return true;
        },

        render: function  () {
            return this;
        }
    });
});