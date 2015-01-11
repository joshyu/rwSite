define([
    'app',
    'backbone',
    'underscore',
    'models/ModelBase'
], function (app, Backbone,  _,  ModelBase) {
    'use strict';
    return ModelBase.extend({
        _service: 'sitestats',
        requests: {
            'sitestats:report' : {
                url:'items',
                type: 'list',
                noPace: true,
                deps: [
                    'sitestats:count:week',
                    'sitestats:count:month',
                    'sitestats:count:all',
                ],
                parseData: '_handleSiteStatsReports'
            },
            'sitestats:count:all' : {
                url:'items',
                noPace: true,
                listProperties: "ItemCount",
                returnFields: "ItemCount"
            },

            'sitestats:count:week' : {
                url:'count',
                noPace: true,
                getQueryParameters: function(){
                    var _params = {};
                    var d= new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    d = new Date(year + '/'+ month +'/' + day);
                    d.setDate(day-7);                    
                    _params.filters = "Created ge datetime'"+ d.toISOString()  +"'"; //Created

                    return _params;
                }
            },
            'sitestats:count:month' : {
                url:'count',
                noPace: true,
                getQueryParameters: function(){
                    var _params = {};
                    var d= new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth() ;
                    var day = d.getDate();

                    if(month == 0){
                        month = 12;
                        year --;
                    }

                    d = new Date(year + '/'+ month +'/' + day);
                    _params.filters = "Created ge datetime'"+ d.toISOString()  +"'";

                    return _params;
                }
            }
        },
        commands: {
            'sitestats:new' : {
                url:'items',
                noPace: true,
                type: 'create'
            }
        },

        visit: function(hashfrag){
            var userId= app.preloaded.user && app.preloaded.user.info.related.id;
            if(!userId) return false;

            if(!hashfrag || hashfrag.length == 0){
                hashfrag = 'portal';
            }else{
                hashfrag = hashfrag.replace(/^campus\//,'');
            }

            var data = {
                whoId: userId,
                view: hashfrag
            };

            var posted = {data : data};
            var that = this;
            posted.success = function(){
                var siteStats = app.preloaded.siteStats;
                 siteStats.week ++;
                 siteStats.month ++;
                 siteStats.whole++;

                 app.vent.trigger('app:sitestats:updated', siteStats);
            }

            this.execute('sitestats:new', posted);
        },

        _handleSiteStatsReports: function(data){
             var labels= ['week', 'month', 'whole'];
             var _data = {};
             for(var i=0,n=data.length;i<n;++i){
                _data[ labels[i] ] = Number(data[i]);
             }

             return _data;
        }
    });
});