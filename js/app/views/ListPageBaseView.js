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
        /*regionType: _region,*/
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
            PanelHelper.append(this, 'list', {highlighted: true});

        },

        getFrmData: function  (frm) {
            if(!frm) return false;
            var elems = frm.elements;
            var _obj = {};
            _.each(elems, function  (elem, i) {
                var _elemName= elem.name;
                if(_elemName && !_obj[_elemName]){
                    _obj[_elemName] = elems[_elemName].value;
                }
            });

            return _obj;
        },

        //TODO: parameter debug, data not passed correctly.
        onSearch: function(e) {
            e.preventDefault();
            var frm= e.target;
            var data = this.getFrmData(frm);

            _.extend(this.panels.list.options, data);
            PanelHelper.update(this, 'list');
        }
    });
});