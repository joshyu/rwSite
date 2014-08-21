define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/contactlist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        tagName: "tbody",
        template : template,
        className:'',
        pageNo: 0,
        request: {
            model : 'contacts',
            key: 'contacts:fulllist',
            getOptions: 'getRequestOption',
            dataHandler: 'filterContacts'
        },

        getTemplateData: function () {
            return {
                lyncEnabled : app.plugins.lync.isEnabled()
            }
        },

         bindDomEvents: function(modelName, model){
            if(modelName == 'contacts'){
                model.on('noNextUrl', function(){
                    if(this.containerLayer){
                        this.containerLayer.trigger('removeSeeMoreButton'); 
                    } 
                },this);
            }
        },

        onRender: function(){
            if(app.plugins.lync.isEnabled()){
                app.plugins.lync.bind(this);
            }
        },

        getRequestOption: function(){
            this.options.pageNo = this.options.pageNo || this.pageNo;
            return this.options;
        }
    });
});