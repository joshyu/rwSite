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
            getOptions: 'getRequestOption'
        },

        getTemplateData: function () {
            return {
                lyncEnabled : app.plugins.lync.isEnabled()
            }
        },

        renderData: function (data) {
            //var _data = 
            //delete data.contacts.roots; //we don't need the roots data here.

            this._renderData(data.contacts);
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