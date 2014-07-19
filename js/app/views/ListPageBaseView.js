define([
    'marionette',
    'app',
    'hbs!templates/general/listpagebase',
    'views/PanelHelper'
], function(Marionette, app, template,  PanelHelper) {
    'use strict';

     var _region = Marionette.Region.extend({
        open: function  (view) {
            //this.$el.empty().append(view.el);
            //Marionette.Region.prototype.open.apply(this, arguments);

            if(this.rendered){
                this.$el.append(view.el);
            }else{

                this.rendered = true;
                this.$el.empty().append(view.el);
            }            
        }
     });


    return Marionette.Layout.extend({
        template: template,
        regionType: _region,
        className:"container listpagebase",
        isAdmin: false,
        loadnum: 20,
        pageNo: 0,
        regions: {
            list:  '.panel-body-list'        
        },

        events: {
            'click .seemore > .link' : 'doSeeMore'
        },

        initialize: function(){
            var _hilightedMenuItem = Backbone.history.getFragment();
            if(_hilightedMenuItem){
                this.on('show', function(){
                    app.execute('navigation:highlight' , _hilightedMenuItem);
                });    
            }

            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },

        serializeData: function () {
            var data = {filters: this.loadSearch()} ;
            return  _.extend(this.templateData || {}, data);
        },
                
        onRender: function () {
            PanelHelper.layout(this, 'listpage');
        },

        doSeeMore: function (e) {
            var link = e.target;

            this.panels.list.options.pageNo = this.pageNo = this.pageNo + 1;
            PanelHelper.layout(this, 'listpage');

            /*var listview = this.getRegion('list').currentView;
            if(listview){
                var $seemoreCon = $(link).parent('.seemore');

                listview.loadMore({
                    trigger: $seemoreCon
                });
            }*/
        }
    });
});