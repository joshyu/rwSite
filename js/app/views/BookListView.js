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

        renderData: function(data){
            var _threshold_new = this.options.threshold_new || 0;
            var _dateChecker = this.isUnderThresHold(_threshold_new);

            _.each(data.campus_book, _.bind(function(bookData){
                bookData.isNew = _dateChecker(bookData.pubdate);
            },this));

            this._renderData(data);
        },

         bindDomEvents: function(modelName, model){
            if(modelName == 'campus_book'){
                model.on('noNextUrl', function(){
                    if(this.containerLayer){
                        this.containerLayer.trigger('removeSeeMoreButton'); 
                    } 
                },this);
            }
        },

        isUnderThresHold: function(threshold_new){
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            
            if(threshold_new > 12){
                year -= parseInt(threshold_new / 12);
                threshold_new = threshold_new % 12;
            }

            if(threshold_new > month){
                year -= 1;
                month = 12 - threshold_new + month;
            }else{
                month -= threshold_new;
            }

            var threshold_dateStr = year + '/'+ month +'/1';
            return function(date){
                return Date.parse(date) >  Date.parse(threshold_dateStr);
            }
        },

        getRequestOption: function(){
            this.options.pageNo = this.options.pageNo || this.pageNo;
            return this.options;
        }
    });
});