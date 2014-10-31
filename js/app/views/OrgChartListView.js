define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/partials/orgchart',
], function(Marionette, app, ViewBase, ModalHelper, template) {
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

            if(itemIndex == void 0 || itemIndex < 0){
                if( $(item).hasClass('btn-home')){
                    itemIndex = 0;

                }else{
                    return false;
                }
            }

            var itemData = this._roots[itemIndex];
            this._roots.splice(itemIndex);
            this.chartview.trigger('banner:root:changed', itemData);            
        },

        push: function(newRoot){
            if(!_.contains(this._roots, newRoot)){
                this._roots.push(newRoot);    
            }            
        },

        getRoots: function(){
            return this._roots;
        },
     };


    return ViewBase.extend({
        template : template,
        className:'panel-body-list-inner orgchart-list',
        request : {
            model : 'contacts',
            key: 'contacts:fulllist'
        },

        events: {
            'click .item-leaf > div' : 'changeChartRoot',
            'click .item-supervisor > div' : 'viewProfile',
            'click .oc-banner .btn' : 'onChangeRoot'
        },

        renderData: function(data){
            this.contacts = data.contacts;
            this.root = this.findRoot(this.contacts.roots);
            this.drawtree(this.root ,true);
            _RootBanner.init(this, this.$('.oc-banner') );            
        },

        //right now, we can only display one root
        //hr manager doesn't report to campus manager, we have to ignore her in the orgchart.
        //will fix later.
        findRoot: function(roots){
            if(roots.length <1){
                return false;
            }else if(roots.length == 1){
                return roots[0];
            }else{
                return _.find(roots, function(v){return v.title.toLowerCase().indexOf('campus') >= 0});
            }
        },

        bindEvents: function(){
            this.on('banner:root:changed', function(data){
                this.root = data;
                this.drawtree(data);
            },this);
        },

        drawtree: function(root, binit){
            if(!root) return false;

            if(binit){
                _RootBanner.reset();
            }

            var _bannerRoots= _RootBanner.getRoots();

            if(this.rendered){
                var that = this;
                this.$el.fadeOut('slow', function(){
                    that._renderData({
                        root : root,
                        bannerRoots : _bannerRoots
                    });

                    $(this).fadeIn('slow');
                    
                })
            }else{
                this._renderData({
                    root : root,
                    bannerRoots: _bannerRoots
                });

                this.rendered = true;
            }

            
        },

        changeChartRoot: function(e){
            var item = e.currentTarget;
            var itemId= $(item).data('item-id');
            var itemData= this.contacts.relations[itemId];

            if(!itemData.reportees || !itemData.reportees.length){
                this.viewProfile(e);
                return false; //real leaf, cannot take root.
            }
            
            if(this.root !== itemData){
               _RootBanner.push(this.root);
            }

            this.root = itemData;
            this.drawtree(itemData);
        },

        viewProfile: function(e){
            var domTrigger= e.currentTarget;
            var empId= Marionette.$(domTrigger).data('item-id');
            if(empId){
                ModalHelper.get('employee', {itemId: empId, domTrigger: domTrigger}).show();
            }

            return false;
        },

        onChangeRoot: function(e){
            _RootBanner.onChangeRoot(e);
        }
    });
});