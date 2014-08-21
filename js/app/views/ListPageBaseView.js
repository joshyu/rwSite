define([
    'marionette',
    'app',
    'hbs!templates/general/listpagebase',
    'views/PanelHelper',
    'views/RegionTypes'
], function(Marionette, app, template,  PanelHelper, RegionTypes) {
    'use strict';
    var ListPageBaseView;

    return ListPageBaseView = Marionette.Layout.extend({
        template: template,
        className:"container campuslistpage",
        isAdmin: false,
        loadnum: 20,
        pageNo: 0,
        noAjax: false,

        regions: {
            list: {
                selector: '.panel-body-list' ,
                regionType:  RegionTypes.ListPageListRegion
            }
        },

        events: {
            'click .seemore > .link' : 'doSeeMore',
            'submit .frmSearch' : "onSearch",
            'reset .frmSearch' : 'onReset'
        },

        templateData: {
            searchfilters_default_title : "All",
            itemMode : true, //show list style or item.
            preventClose: true
        },

        //empty, placeholder.
/*        panels: {
            list : {
                class: '',
                options: {}
            }
        },*/

        initialize: function(){
            var _hilightedMenuItem = Backbone.history.getFragment();
            if(_hilightedMenuItem){
                this.on('show', function(){
                    app.execute('navigation:highlight' , _hilightedMenuItem);
                });    
            }

            this.on('removeSeeMoreButton', this.removeSeeMoreButton, this);
            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },

        removeSeeMoreButton: function(){
            this.$el.find(".seemore").hide();
        },

        resetSeeMoreButton: function(){
           this.$el.find(".seemore").show(); 
        },

        serializeData: function (){
            var data = {filters: this.loadSearch()} ;
            data["loadnum"] = this.loadnum;
            var parentTemplateData = ListPageBaseView.prototype.templateData;
            this.templateData =  _.extend({}, parentTemplateData, this.templateData, data);
            return this.templateData;
        },

        loadSearch: function () {
            return [];
        },
                
        onRender: function () {
            var _itemMode = this.templateData.itemMode;
            PanelHelper.layout(this, {itemMode : _itemMode});
        },

        doSeeMore: function (e) {
            var link = e.target;
            var _itemMode = this.templateData.itemMode;
            this.panels.list.options.pageNo = this.pageNo = this.pageNo + 1;
            PanelHelper.append(this, 'list', {highlighted: true, itemMode: _itemMode});
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

        onReset: function(e){
            this.$('.btn-default-choice').button('toggle');
        },

        onSearch: function(e) {
            e.preventDefault();
            var frm= e.target;
            var data = this.getFrmData(frm);
            var $btnSubmit= $(frm).find('.btnSubmit');
             this.panels.list.options.pageNo = this.pageNo = 0;
             this.panels.list.options.filters = data;
            $btnSubmit.button('search').prop('disabled', true);
            this.resetSeeMoreButton();

            if(this.noAjax){
                setTimeout(function() {
                    $btnSubmit.button('reset').prop('disabled', false);
                }, 500);
            }else{
                app.pace.instance.on('hide', function(){
                    $btnSubmit.button('reset').prop('disabled', false);
                });    
            }

            var _itemMode = this.templateData.itemMode;
            PanelHelper.update(this, 'list', {itemMode : _itemMode});
        }
    });
});