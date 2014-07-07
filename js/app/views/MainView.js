define([
    'marionette',
    'app',
    'hbs!templates/home/layout',
    'views/PanelHelper',
    'bootstrap'
], function(Marionette, app, template,  PanelHelper) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,
        className:"row container",
        regions: {
            news: '.panel-news',
            updates: '.panel-updates',
            survey:'.panel-survey',
            profile: '.panel-profile',
            quicklink: '.panel-links',
            ntBirthday: '.panel-notify-birthday',
            ntNewhire:'.panel-notify-hire',
            suggestion: '.panel-sugesstion'
        },

        panels: {
            news: 'News',
            updates: 'CampusUpdates',
            survey:'Survey',
            profile: 'Profile',
            quicklink: 'Quicklink',
            ntBirthday: 'NTBirthday',
            ntNewhire: 'NTNewHire',
            suggestion: 'Suggestion'
        },

        initialize: function(){
            this.on('show', function(){
                app.execute('navigation:highlight');
            });

            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },

        onRender: function () {
            PanelHelper.layout(this , 'main');
        }
    });
});