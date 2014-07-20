define([
    'marionette',
    'app',
    'hbs!templates/general/listpagebase',
    'views/PanelHelper'
], function(Marionette, app, template,  PanelHelper) {
    'use strict';

     var _region = Marionette.Region.extend({
        open: function(view) {
            if(this.rendered){
                this.$el.append(view.el);
                this.highlight(view.el);
            }else{
                this.rendered = true;
                this.$el.empty().append(view.el);
            }
        },

        highlight: function(el){
            if(!el) return false;
            var $el = $(el);

            $el.addClass('highlighted');
            setTimeout(function(){
                $el.removeClass('highlighted');
            },500);
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
            'click .seemore > .link' : 'doSeeMore',
            'submit .frmSearch' : "onSearch"
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
            PanelHelper.layout(this);
        },

        doSeeMore: function (e) {
            var link = e.target;

            this.panels.list.options.pageNo = this.pageNo = this.pageNo + 1;
            PanelHelper.layout(this);
            //PanelHelper.update(this, 'list');

        },

        onSearch: function(e) {
            e.preventDefault();
            var frm= e.target;
            var data = {formData: this.$(frm).serialize() };

            _.extend(this.panels.list.options, {formData: this.$(frm).serialize() });


            debugger;
        }
    });
});