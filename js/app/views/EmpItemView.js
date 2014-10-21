define([
    'app',
    'marionette',
    'views/ViewBase',
    'hbs!templates/partials/empitem'
], function(app, Marionette, ViewBase, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:'row contact_modal_body',
        request: {
            model : 'contacts',
            key: 'contacts:contactInfo',
            getOptions: 'getRequestOption'
        },

        events: {
            'click .profilelink' : 'clickAvatar',
            'click .returnhome'  : 'showMyProfile',
            'click .reportees .indicators li' : 'clickReporteeIndicator'
        },

        initialize: function(options){
            this.defaultItemId = options.itemId;
            ViewBase.prototype.initialize.call(this, arguments);
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;

            return {
                id: itemId
            };
        },

        getTemplateData: function () {
            return {
                lyncEnabled : app.plugins.lync.isEnabled()
            }
        },

        onRender: function(){
            this.$el.find('a.profilelink > img').tooltip();
            if(app.plugins.lync.isEnabled()){
                app.plugins.lync.bind(this);
            }
        },

        clickAvatar: function(e){
            e.preventDefault();
            var linkDom = e.currentTarget;
            var userId = $(linkDom).data('contactid');
            this.options.itemId = userId;
            this.handleRequests();
        },

        clickReporteeIndicator: function(e){
            e.preventDefault();
            var $dom = $(e.currentTarget);
            $dom.siblings().removeClass('active').end().addClass('active');
            var $reportees = this.$('.reportees .items');
            if($reportees.length <= 1) return false;

            var index = Number($dom.data('index'));
            $reportees.removeClass('active').eq(index).addClass('active');
        },

        showMyProfile: function(e) {
            this.options.itemId = this.defaultItemId;
            this.handleRequests();
        },

        isme: function (data) {
            if(!data || !(data = data.contacts) ) return false;
            var _isme = false;

            if(!this.curUserEmail || this.curUserEmail == data.email){
                this.curUserEmail = data.email;
                _isme = true;
            }

            this.templateData = this.templateData || {};
            this.templateData.isme = _isme;

            return _isme;
        },

        splitReportees: function _splitReportees(contact){
            var _arr = []; 
            if(contact && contact.id && contact.reportees){
                var maxperpage = 12; //4*3.
                var num = contact.reportees.length ;
                var i = 0;
                while(i < num){
                    _arr.push(contact.reportees.slice(i, i+maxperpage));
                    i = i + maxperpage;
                }
            }

            return _arr;
        },

        renderData: function (data) {
            this.isme(data);
            data.reporteeArr = this.splitReportees(data.contacts);
            var FADEOUT_CLS = 'fadeout';
            var that = this;
           if(this.rendered){
                 this.$el.on('webkitTransitionEnd transitionend MSTransitionEnd msTransitionEnd oTransitionEnd' , function(){
                        var $this= $(this);
                        if($this.hasClass(FADEOUT_CLS)){
                            that._renderData(data);

                            setTimeout(function(){
                                $this.removeClass(FADEOUT_CLS);    
                            },0);                            
                        }

                        $this.off('webkitTransitionEnd transitionend MSTransitionEnd msTransitionEnd oTransitionEnd');
                 });

                 this.$el.addClass(FADEOUT_CLS);
            }else{
                this._renderData(data);
                this.rendered = true;
            }
        }
    });
});