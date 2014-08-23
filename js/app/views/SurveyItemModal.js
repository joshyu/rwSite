define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/surveyitem',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade srcitem campus_modal',
        footer: '',
        request: {
            model: 'campus_survey',
            key: 'campus:survey:item:info',
            getOptions: 'getRequestOption'
        },

        templateData: {
            contentClass : 'campus-item'
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        },

        handleData: function(data){
            var joinLinkTitle = data.campus_survey.joinLinkTitle;
            var that = this;
            $.when(app.modelHelper.get('campus_survey').requestJoinNum(joinLinkTitle)).done(function(num){
                 that.$('.modal-dialog .numjoined').html(num).addClass('label-primary');
            });

            return ModalBase.prototype.handleData.apply(this, arguments);
        }
    });
});