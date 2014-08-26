define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'training',
        requests: {
            'campus:events:training:updates' : {
                url:'items',
                type: 'list',
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Teacher/Title":"author",
                    "Teacher/Id":"authorId",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "joinLinkTitle":"joinLinkTitle",
                    "timespan": "timespan",
                    "TrainingCode": "trainingcode",
                    "TrainingRoom": "room",
                    "Rank": "Rank",
                    "available" : "available"
                },
                queryParameters: {
                    expand: 'Category,Teacher,AttachmentFiles',
                    orderby: 'EventDate desc'
                },
                noHandleAttachedImage: true
            },

             'campus:events:training:updates:short' : {
                url:'items',
                type: 'list',
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "EventDate": "pubdate"
                },
                queryParameters: {
                    orderby: 'EventDate desc'
                }
            },

             //fetch those available and not outdated src events.
            'campus:events:training:fresh': {
                url: 'items',
                type: 'list',
                noPace: true,
                getQueryParameters: function(){
                    var _params = {
                        expand: 'Category,Teacher,AttachmentFiles',
                        orderby: 'EventDate desc'
                    };

                    _params.filters = "available eq 1 and EventDate gt datetime'"+ new Date().toISOString()  +"'";
                    return _params;
                },
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Teacher/Title":"author",
                    "Teacher/Id":"authorId",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "joinLinkTitle":"joinLinkTitle",
                    "timespan": "timespan",
                    "TrainingCode": "trainingcode",
                    "TrainingRoom": "room",
                    "Rank": "Rank",
                    "available" : "available"
                }
            },

            'campus:events:training:userowned' : 'getUserOwnedTraining',

            'campus:training:item:info' : {
                url:'items',
                returnFields: {
                    "Id": "id",
                    "Title": "title",
                    "Category/Title": "category",
                    "Teacher/Title":"author",
                    "Teacher/Id":"authorId",
                    "Attachments": "",
                    "content" : "content",
                    "AttachmentFiles": "attachments",
                    "EventDate": "pubdate",
                    "JoinLink": "joinLink",
                    "joinLinkTitle":"joinLinkTitle",
                    "timespan": "timespan",
                    "TrainingCode": "trainingcode",
                    "TrainingRoom": "room",
                    "Rank": "Rank",
                    "available" : "available"
                },
                queryParameters: {
                    expand: 'Category,Teacher,AttachmentFiles'
                },
                noHandleAttachedImage: true
            },

            'campus:events:training:donelist' : {
                url : "donelist",
                type: 'list',
                noPace: true,
                returnFields: 'trainingId',
                getQueryParameters: function(data){
                    var _params = {};
                    var nameId = data.nameId;
                    if(nameId){
                        _params.filters = "nameId eq \'"+ nameId +"\'";
                    }

                    delete data.nameId;
                    return _params;
                }
            }
        },
        commands: {
            'campus:events:training:markdone' : {
                url : "donelist",
                type: 'create' //update, delete, create. by default it is update.
            },

            //deprecated.
            'campus:events:training:checktrcode' : {
                url : "items",
            }
        },

        _lib : {
            training_states: {
                name: 'available',
                states: [
                    {
                        id: 1,
                        title: 'available'
                    },
                    {
                        id: 0,
                        title: 'closed'
                    }
                ]
            }
        },

        getUserOwnedTraining: function(data){
            var namedId = data.nameId;
            var that = this;
            return this.request('campus:events:training:fresh').then(function(items) {
                var mytrainings = [];
                for(var i=items.length-1;i>=0;--i){
                    if(items[i].authorId === namedId){
                        mytrainings.unshift.apply(mytrainings, items.splice(i,1));
                    }
                }

                return $.when(that.filterUserJoinedItem(items, namedId)).then(function(items){
                    return mytrainings.concat(items);
                });
            });
        },
        permissionDef: {
            link: '/campus/Lists/TrainingList/AllItems.aspx',
            perm: 'editListItems',
            urlKey: 'items'
        }
    });
});