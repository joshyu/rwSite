define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/trainingpagelist',
    'views/ModalHelper'
], function(Marionette, app, ViewBase,  template, ModalHelper) {
    'use strict';
    return ViewBase.extend({
        tagName: "tbody",
        template : template,
        className:'',
        pageNo: 0,
        request: {
            model : 'campus_training',
            key: 'campus:events:training:updates',
            getOptions: 'getRequestOption'
        },

        events:{
            'click  tr' : 'viewTrainingItem'
        },

        viewTrainingItem: function(e){
            if(e.target.nodeName.toLowerCase() == 'a'){
                return true;
            }

            var domTrigger= e.currentTarget;
            var itemId= Marionette.$(domTrigger).data('item-id');
            e.preventDefault();
            if(itemId){
                ModalHelper.get('training', {itemId: itemId, domTrigger: domTrigger}).show();
            }

            return false;
        },

         bindDomEvents: function(modelName, model){
            if(modelName == 'campus_training'){
                model.on('noNextUrl', function(){
                    if(this.containerLayer){
                        this.containerLayer.trigger('removeSeeMoreButton'); 
                    } 
                },this);
            }
        },

        getRequestOption: function(){
            this.options.pageNo = this.options.pageNo || this.pageNo;
            return this.options;
        }
    });
});