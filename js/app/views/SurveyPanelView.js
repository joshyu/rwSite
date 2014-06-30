define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/survey',
], function(Marionette, app, ViewBase,  template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        requests: [
            {
                id: 'new',
                model: 'campus_survey',
                key: 'campus:survey:newest'
            },
            {
                id: 'popular',
                model: 'campus_survey',
                key: 'campus:survey:popular'
            }
        ]
    });
});