define([
    'app',
    'backbone',
    'underscore',
    'models/SPService'
], function (app, Backbone,  _,  SPService) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            landingpageLink: {
                "id": 0,
                "title" : "Home",
                "parentid": 0,
                "icon": "fa-home",
                "link":"#"
            }
        },

        initialize: function () {
            //this.service = SPService.List('_sys', 'navigation');
            app.modelHelper.setHandler('navigation:fetch:list', this.fetchList, this);
        },

        formatMenuList: function (data) {
            data.unshift( this.get('landingpageLink') );
            return data;
        },

        _reformatDataAsTree: function  (data) {
            if(!data){
                return false;
            }

           var _data= [];  _data.roots= [];
           var i,len,item,pid;
           for(i=0,len=data.length;i<len;++i){
                item= data[i];
                pid= item.parentid;
                _data[item.id] =_.extend(item, {subs: []});

                if(pid > 0){
                    _data[pid].subs.push(item);
                }else{
                    _data.roots.push(item);
                }
            }

            return _data.roots;
        },

        fetchList: function() {
            var that= this;
            var dfd= $.Deferred();
            var opts= {
                url: "js/data/navigation.json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    dfd.resolve(that._reformatDataAsTree(data.data));
                }
            };

            Backbone.ajax(opts);
            return dfd.promise();
        }        
    });
});