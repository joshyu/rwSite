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
            'click .returnhome'  : 'showMyProfile'
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

        showMyProfile: function(e) {
            this.options.itemId = void 0;
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

        renderData: function (data) {
            this.isme(data);
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