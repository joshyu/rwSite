define([
    'app',
    'backbone',
    'underscore',
    'models/SPService'
], function (app, Backbone,  _,  SPService) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: 'SRC Events',
        },

        initialize: function () {
            //this.service = SPService.List('_sys', 'navigation');
            app.modelHelper.setHandler('campus:events:src:updates',  this.fetchEventSrcUpdate, this);
            app.modelHelper.setHandler('campus:src:item:info',  this.fetchSrcItem, this);
        },

        fetchSrcItem: function(args){
            var itemId= args.id;
            var dfd= $.Deferred();

            if(_.isUndefined(itemId)){
                dfd.reject(false);
            }else{
                var opts= {
                    url: "js/data/src_item.json",
                    type: 'GET',
                    dataType: 'json',
                    data: {id: itemId},
                    success: function(data){
                        dfd.resolve(data);
                    }
                };

                Backbone.ajax(opts);
            }
            
            return dfd.promise();
        },

        fetchEventSrcUpdate: function () {
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/events_src_updates.json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    dfd.resolve(data.data);
                }
            };

            Backbone.ajax(opts);
            return dfd.promise();
        }
    });
});