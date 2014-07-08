define([
    'marionette',
    'app',
    'hbs!templates/profile/layout',
    'views/PanelHelper'
], function(Marionette, app, template,  PanelHelper) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,
        className:"container",
        initialize: function(){
            this.on('show', function(){
                app.execute('navigation:dehighlight');
            });

            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },
        regions: {
            empdata : '.panel-emprofile .panel-body'
        },

        panels: {
            empdata: 'EmpItemView'
        },
                
        onRender: function () {
            PanelHelper.layout(this);
        }
    });
});