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
                    /*'campus_training/campus:events:training:userowned'*/
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
                }
            },

            'user:role': {
                url: 'currentUserRoles',
                cached: true,
                type: 'list',
                returnFields: "Title"
            }
        },

        handleUserAllRelatedData: function(data) {
            return _.object(['info','srcData'], data);
        },

        handleUserInfo: function(data){
            data.account = data.account.split("|")[1] ;
            return data;
        }
    });
});