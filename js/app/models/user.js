define([
    'app',
    'backbone',
    'models/ModelBase',
], function(app, Backbone, ModelBase) {
    'use strict';

    return ModelBase.extend({
        requests: {
            'user:info': 'fetchUserInfo'
        },

        _service: 'user',
        fetchUserInfo: function() {
            // fetch user info, role, campus updates.
            var key = 'user:info';
            var dfd = $.Deferred();
            var that = this;
            var service = this.service;
            var _data = this.getCached(key);

            if (_data) {
                dfd.resolve(_data);
            } else {
                var dfduser = service.fetchCurrentUser().then(function(userdata) {
                    return service.fetchMyRole(userdata.Id).then(function(roles) {
                        userdata.roles = roles;
                        return userdata;
                    });
                });

                var dfdCampusSrcUpdates = null; // app.modelHelper.get('campus_src').request('campus:events:src:userowned');
                var dfdCampusTrainingUpdates = null; //app.modelHelper.get('campus_training').request('campus:events:training:userowned');

                $.when(dfduser, dfdCampusSrcUpdates, dfdCampusTrainingUpdates).done(function(user, srcData, trainingData) {
                    //debugger;
                    _data = {
                        info: user,
                        srcData: srcData,
                        trainingData: trainingData
                    };

                    that.cacheData(key, _data);
                    dfd.resolve(_data);
                });
            }

            return dfd.promise();
        }
    });
});