define([
    'app',
    'backbone',
    'underscore',
    'models/SPService'
], function (app, Backbone,  _,  SPService) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            title: 'Training Center',
        },

        initialize: function () {
            //this.service = SPService.List('_sys', 'navigation');
            app.modelHelper.setHandler('campus:events:training:updates',  this.fetchEventTrainingUpdate, this);
            app.modelHelper.setHandler('campus:training:item:info',  this.fetchTrainingItem, this);
        },

        fetchTrainingItem: function(args){
            var itemId= args.id;
            var dfd= $.Deferred();

            if(_.isUndefined(itemId)){
                dfd.reject(false);
            }else{
                var opts= {
                    url: "js/data/training_item.json",
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

        fetchEventTrainingUpdate: function() {
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/events_training_updates.json",
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