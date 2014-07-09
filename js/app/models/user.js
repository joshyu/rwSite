define([
    'app',
    'backbone',
    'models/ModelBase',
], function (app, Backbone, ModelBase) {
    'use strict';

    return ModelBase.extend({
        requests:{
            'user:info' : 'fetchUserInfo'
        },

        fetchUserInfo: function(){
            // fetch user info, role, campus updates.
            var key = 'user:info';
            var dfduser = this._fetchitem({url: 'js/data/user.json'});
            var dfdRole = this._fetchitem({url: 'js/data/role.json'});
            var dfdCampusSrcUpdates = app.modelHelper.get('campus_src').request('campus:events:src:userowned');
            var dfdCampusTrainingUpdates = app.modelHelper.get('campus_training').request('campus:events:training:userowned');
            var dfd = $.Deferred();
            var that = this;
            var _data = this.getCached(key);

            if(_data){
                dfd.resolve(_data);
            }else{
                $.when(dfduser, dfdRole, dfdCampusSrcUpdates, dfdCampusTrainingUpdates).done(function(user,role,srcData, trainingData){
                      _data = {
                        info : user,
                        role: role,
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