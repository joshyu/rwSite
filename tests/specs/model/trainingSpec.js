define(function() {
    'use strict';

    return function(app) {
        describe('campus training model ', function() {
            var model = app.modelHelper.get('campus_training');

            it("fetch newest training list", function(done) {
                model.request('campus:events:training:updates').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch userowned training list", function(done) {
                model.request('campus:events:training:userowned').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});