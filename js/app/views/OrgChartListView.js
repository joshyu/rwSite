define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/orgchart',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
     var _RootBanner = {
        init : function(view, elem){
            this.$elem = $(elem);
            this._roots = [];
            this.chartview = view;

            return this;
        },
        reset: function(){
            this._roots = [];
        },

        onChangeRoot: function(e){
            e.preventDefault();
            var item = e.currentTarget;
            var itemIndex = $(item).data('item-index');
            if(itemIndex == void 0 || itemIndex < 0) return false;
            var itemData = this._roots[itemIndex];
            this._roots.splice(itemIndex);

            this.chartview.trigger('banner:root:changed', itemData);            
        },

        push: function(newRoot){
            this._roots.push(newRoot);
        },

        getRoots: function(){
            return this._roots;
        },
     };


    return ViewBase.extend({
        template : template,
        className:'panel-body-list-inner',
        request : {
            model : 'contacts',
            key: 'contacts:fulllist'
        },

        events: {
            'click .item-leaf > div' : 'changeChartRoot',
            'click .oc-banner .btn' : 'onChangeRoot'
        },

        renderData: function(data){
            this.contacts = data.contacts;
            this.root = this.contacts.roots[0];
            this.drawtree(this.root ,true);
            _RootBanner.init(this, this.$('.oc-banner') );            
        },

        bindEvents: function(){
            this.on('banner:root:changed', function(data){
                this.drawtree(data);
            },this);
        },

        drawtree: function(root, binit){
            if(!root) return false;

/*            if(root != this.root){
                _RootBanner.push(this.root);
                this.root = root;
            }*/

            if(binit){
                _RootBanner.reset();
            }

            var _bannerRoots= _RootBanner.getRoots();

            this._renderData({
                root : root,
                bannerRoots: _bannerRoots
            });
        },

        changeChartRoot: function(e){
            var item = e.currentTarget;
            var itemId= $(item).data('item-id');
            var itemData= this.contacts[itemId];
            
            if(this.root){
               _RootBanner.push(this.root);
            }

            this.root = itemData;
            this.drawtree(itemData);
        },

        onChangeRoot: function(e){
            _RootBanner.onChangeRoot(e);
        }
    });
});