define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'navigation',
        requests:{
            'navigation:fetch:list' :  {
                type: 'list',
                url: 'items', 
                cached: true,
                parseData: '_reformatDataAsTree',
                returnFields: {
                    'Id': 'id',
                    'Title': 'title',
                    'ParentId': 'parentid',
                    'Link': 'link'
                }
            }
        },

        formatMenuList: function (data) {
            data.unshift({
                "id": 0,
                "title" : "Home",
                "parentid": 0,
                "icon": "fa-home",
                "link":"#"
            });

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

                if(item.link && /^http(s)?\:/.test(item.link)){
                    item.isExternalLink = true;
                }

                pid= item.parentid;
                _data[item.id] =_.extend(item, {subs: []});

                if(pid > 0){
                    _data[pid].subs.push(item);
                }else{
                    _data.roots.push(item);
                }
            }

            return _data.roots;
        }
    });
});