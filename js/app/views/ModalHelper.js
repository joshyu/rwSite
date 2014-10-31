define([
    'marionette',
    'views/SrcItemModal',
    'views/TrainingItemModal',
    'views/SurveyItemModal',
    'views/EmployeeItemModal',
    'views/SuggestionModal',
    'views/PmImageItemModal',
    'views/NewsItemModal',
    'views/NewHiresItemModal'
], function(Marionette, SrcItemModal, TrainingItemModal, SurveyItemModal, 
                EmployeeItemModal, SuggestionModal, PmImageItemModal, NewsItemModal, NewHiresItemModal) {
    'use strict';
    var _modalMap = {
        items:{
             src : SrcItemModal,
             training: TrainingItemModal,
             survey: SurveyItemModal,
             news: NewsItemModal,
             employee: EmployeeItemModal,
             suggestion:  SuggestionModal,
             pmImage: PmImageItemModal,
             newhires: NewHiresItemModal
        }
    };

    return {
        /* modalKey: src, training,survey
        real modal class: SrcItemModal */
        getItem: function (modalKey,options) {
             var _modalClass= _modalMap.items[modalKey];
             if(_modalClass){
                return new _modalClass(options);
             }
        },

        //by default we only support item display in modal dialog.
        get: function(modalKey,options){
            return this.getItem(modalKey,options);
        }
    };
});