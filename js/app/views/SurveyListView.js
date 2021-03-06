define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/surveylist',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-survey-list campus-items row',
        pageNo: 0,
        request : {
            model : 'campus_survey',
            key: 'campus:survey:newest',
            getOptions: 'getRequestOption'
        },

        getRequestOption: function(){
            this.options.pageNo = this.options.pageNo || this.pageNo;
            return this.options;
        }
    });
});