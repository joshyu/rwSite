define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase',
], function(app, Backbone, _, ModelBase) {
    'use strict';

    return ModelBase.extend({
        _service: 'user',

        requests: {
            'user:all:related': 'getUserAllRelatedData',

            'user:info': {
                url: 'currentUser',
                returnFields: {
                    'Id': 'id',
                    'LoginName': 'account',
                    'Title': 'name',
                    'Email': 'email',
                    'IsSiteAdmin': 'isadmin'
                },
                parseData: 'handleUserInfo'
            },

            'user:info:role:related': {
                deps: [
                    'user:info:role',
                    'contacts/contacts:fulllist'
                ],
                parseData: 'handleUserWithRelated'
            },

            'user:info:role': {
                url: 'currentUser',
                returnFields: {
                    'Id': 'id',
                    'LoginName': 'account',
                    'Title': 'name',
                    'Email': 'email',
                    'IsSiteAdmin': 'isadmin',
                    'Groups/Title': 'roles'
                },

                data: {
                    expand: 'Groups'
                },
                parseData: "handleUserInfo"
                /*
                chain sample: 
                the functionality is left, but we don't use it now,
                because we have better solution : $expand=Groups.

                deps: "user:info",
                cached: true,
                chain: {
                    key: "user:role",
                    attrName: "roles",
                    data: function(depData) {
                        return {
                            id : depData.id
                        };
                    }
                }*/
            },

            'user:role': {
                url: 'currentUserRoles',
                cached: true,
                type: 'list',
                returnFields: "Title"
            }
        },

        handleUserWithRelated: function(data) {
            var contacts= data.pop();
            var userInfo= data[0];
            userInfo.related = _.find(contacts.relations, function(_contact){ return _contact.email == userInfo.email});
            userInfo.image = userInfo.related.photo;

            return {
                info : userInfo
            };
        },

        getUserAllRelatedData: function(data){
            var that = this;
            return this.request('user:info:role:related').then(function(user){
                var namedId = user.info.related.nameRecordId;
                var _dfds = [], dfd= null;
                var reqKeys = {
                    'campus_src' : 'campus:events:src:userowned',
                   'campus_training' : [
                            'campus:events:training:userowned',
                            'campus:events:training:donelist'
                    ]
                };

                _.each(reqKeys, function(reqKey, modelId){
                    if(_.isString(reqKey) ){
                        _dfds.push( app.modelHelper.get( modelId ).request( reqKey, {nameId : namedId} ) );    
                    }else if(_.isArray(reqKey)){
                        var _reqlst= _.map(reqKey, function(_key){
                            return app.modelHelper.get( modelId ).request( _key, {nameId : namedId} );
                        });

                        _dfds.push.apply(_dfds, _reqlst);
                    }
                });

                return $.when.apply($, _dfds).then(function(){
                    var data = [].slice.call(arguments);
                    user.srcData = data[0];
                    user.srcDataIds = _.invert(_.pluck( data[0],'id'));
                    user.trainingData = data[1];
                    user.trainingDataIds = _.invert(_.pluck( data[1], 'id'));
                    user.trainingDoneList = _.invert(data[2]);
                    return user;
                });
            })
        },

        handleUserInfo: function(data){
            data.account = data.account.split("|")[1] ;
            return data;
        }
    });
});