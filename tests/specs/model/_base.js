define([
    'app',
    'models/ModelHelper',
    './userSpec',
    './srcSpec',
    './bookSpec',
    './qlinkSpec',
    './navigationSpec',
    './newsSpec',
    './contactsSpec',
    './officeSpec',
    './surveySpec',
    './trainingSpec',
    './suggestionSpec'
], function(app) {
    'use strict';
    var specs = [].slice.call(arguments, 2);
    app.start();

    describe('model test specs', function() {
        specs.forEach(function(spec, k) {
            spec(app);
        });
    });
});