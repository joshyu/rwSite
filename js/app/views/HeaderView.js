define([
    'app',
    'views/ViewBase',
    'marionette',
    'hbs!templates/layouts/header'
], function(app, ViewBase, Marionette, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:"brand",
        getTemplateData: function(){
             return  {
                user : app.preloaded.user.info
             };
        }

    });
});