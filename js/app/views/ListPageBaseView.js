define([
    'marionette',
    'app',
    'hbs!templates/general/listpagebase',
    'views/PanelHelper'
], function(Marionette, app, template,  PanelHelper) {
    'use strict';
    return Marionette.Layout.extend({
        template: template,
        className:"container listpagebase",
        isAdmin: false,
        regions: {
             searchbox : '.panel-body-searchbox',
             list: '.panel-body-list'
        },        

        panels: {
        },

        initialize: function(){
            /*this.on('show', function(){
                app.execute('navigation:dehighlight');
            });*/

            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },

        serializeData: function () {
            var data = {filters: this.loadSearch()} ;
            return  _.extend(this.templateData || {}, data);
        },
                
        onRender: function () {
            PanelHelper.layout(this, 'listpage');
        }
    });
});