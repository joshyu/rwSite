define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/srclist',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        template : template,
        className:'panel-src-list campus-items',
        getTemplateData: function(){
            return  {
               campus_src : app.user.srcData
            };
        }
    });
});