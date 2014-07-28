define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/booklist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        tagName: "tbody",
        template : template,
        className:'',
        pageNo: 0,
        request: {
            model : 'campus_book',
            key: 'campus:book:updates',
            getOptions: 'getRequestOption'
        },

        getRequestOption: function(){
            this.options.pageNo = this.options.pageNo || this.pageNo;
            return this.options;
        }
    });
});