define([
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'marionette',
    'hbs!templates/layouts/header'
], function(app, ViewBase, ModalHelper, Marionette, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
         events: {
            'click .opener': 'openSuggestionBox'
        },
        className:"brand",
        getTemplateData: function(){
             return  {
                user : app.preloaded.user.info
             };
        },
        openSuggestionBox: function(e){
            ModalHelper.get('suggestion').show();
            return false;
        }

    });
});