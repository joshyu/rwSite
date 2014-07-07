define([
    'marionette',
    'hbs!templates/profile/layout',
    'views/PanelHelper'
], function(Marionette, template,  PanelHelper) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,
        className:"container",
        /*regions: {
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

        onRender: function () {
            PanelHelper.layout(this);
        }*/
    });
});