define([
    'marionette',
    'views/ViewBase',
    'hbs!templates/partials/empitem'
], function(Marionette, ViewBase, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        className:'row contact_modal_body',
        request: {
            model : 'contacts',
            key: 'contacts:contactInfo',
            getOptions: 'getRequestOption'
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        }
    });
});