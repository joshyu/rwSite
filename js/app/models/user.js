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
            'user:all:related': {
                cached: true,
                deps: [
                    'user:info:role',
                    'campus_src/campus:events:src:userowned',
                    'campus_training/campus:events:training:userowned',
                    'contacts/contacts:fulllist'
                ],
                parseData: 'handleUserAllRelatedData'
            },

            'user:info': {
                url: 'currentUser',
                cached: true,
                returnFields: {
                    'Id': 'id',
                    'LoginName': 'account',
                    'Title': 'name',
                    'Email': 'email',
                    'IsSiteAdmin': 'isadmin'
                },
                parseData: 'handleUserInfo'
            },

            'user:info:role': {
                url: 'currentUser',
                cached: true,
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

        handleUserAllRelatedData: function(data) {
            var contacts= data.pop();
            var userInfo= data[0];
            userInfo.related = _.find(contacts.relations, function(_contact){ return _contact.email == userInfo.email});
            userInfo.image = userInfo.related.photo;

            return _.object(['info','srcData', 'trainingData'], data);
        },

        handleUserInfo: function(data){
            data.account = data.account.split("|")[1] ;
            return data;
        }
    });
});