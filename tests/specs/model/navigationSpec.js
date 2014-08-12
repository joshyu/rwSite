define(function() {
    'use strict';

    return function(app) {
        describe('navigation menu model ', function() {
            var model = app.modelHelper.get('navigation');

            it("fetch navigation menu items", function(done) {
                model.request('navigation:fetch:list').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});