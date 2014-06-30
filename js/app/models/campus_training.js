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