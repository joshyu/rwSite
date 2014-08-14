define(function() {
    'use strict';

    return function(app) {
        describe('campus survey model ', function() {
            var model = app.modelHelper.get('campus_survey');

            it("fetch newest survey list", function(done) {
                model.request('campus:survey:newest').done(function(items) {
                    debugger;
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});