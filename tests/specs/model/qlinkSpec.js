define(function() {
    'use strict';

    return function(app) {
        describe('campus quicklink model ', function() {
            var model = app.modelHelper.get('links');

            it("fetch campus quick link items", function(done) {
                model.request('links:quicklinks').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});