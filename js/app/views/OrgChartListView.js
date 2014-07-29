define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/orgchart',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-body-list-inner',
        request : {
            model : 'contacts',
            key: 'contacts:fulllist'
        }
    });
});