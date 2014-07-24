define([
    'marionette',
    'app',
    'hbs!templates/general/listpagebase',
    'views/PanelHelper',
    'views/RegionTypes'
], function(Marionette, app, template,  PanelHelper, RegionTypes) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,
        className:"container listpagebase",
        isAdmin: false,
        loadnum: 20,
        pageNo: 0,
        regions: {
            list: {
                selector: '.panel-body-list' ,
                regionType:  RegionTypes.ListPageListRegion
            }
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

        onSearch: function(e) {
            e.preventDefault();
            var frm= e.target;
            var data = this.getFrmData(frm);
            var $btnSubmit= $(frm).find('.btnSubmit');
             this.panels.list.options.pageNo = this.pageNo = 0;
            _.extend(this.panels.list.options, data);

            $btnSubmit.button('search').prop('disabled', true);
            app.pace.instance.on('hide', function(){
                $btnSubmit.button('reset').prop('disabled', false);
            });

            PanelHelper.update(this, 'list');
        }
    });
});