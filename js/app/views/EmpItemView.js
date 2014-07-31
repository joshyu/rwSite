define([
    'marionette',
    'views/ViewBase',
    'hbs!templates/partials/empitem'
], function(Marionette, ViewBase, template) {
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
            'click .profilelink' : 'clickAvatar'
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        },

        onRender: function(){
            this.$el.find('a.profilelink > img').tooltip();
        },

        clickAvatar: function(e){
            e.preventDefault();
            var linkDom = e.currentTarget;
            var userId = $(linkDom).data('contactid');
            this.options.itemId = userId;
            this.handleRequests();
        },
        renderData: function (data) {
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