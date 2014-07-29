define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/officelayout',
    'zoom'
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-officelayout-list',
        request : {
            model : 'campus_office',
            key: 'campus:office:layout'
        },

        onRender: function(){
            this.$('.office-image-container').zoom();
        }
    });
});