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
        templateData: {},
        initialize: function(){
            /*this.on('show', function(){
                app.execute('navigation:dehighlight');
            });*/

            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },
        regions: {
             searchbox : '.panel-body-searchbox',
             list: '.panel-body-list'
        },        

        panels: {     
        },

        serializeData: function () {
            return  this.templateData || {};
        },
                
        onRender: function () {
            PanelHelper.layout(this, 'listpage');
        }
    });
});