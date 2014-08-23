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
        },

         bindDomEvents: function(modelName, model){
            if(modelName == 'campus_survey'){
                model.on('noNextUrl', function(){
                    if(this.containerLayer){
                        this.containerLayer.trigger('removeSeeMoreButton'); 
                    } 
                },this);
            }
        },

        onRender: function(){
            var that = this;
            var joinLinkTitle = '';
            var numNodes = this.$('.numjoined');
            if(this.joinLinkTitles){
                _.each(this.joinLinkTitles, function(title, i){
                    $.when(app.modelHelper.get('campus_survey').requestJoinNum(title)).done(function(num){
                         numNodes.eq(i).html(num).addClass('label-primary');
                    });
                });
            }
        },

        renderData: function (data) {
            this.joinLinkTitles = _.pluck(data.campus_survey , 'joinLinkTitle');
            this._renderData(data);
        }
    });
});