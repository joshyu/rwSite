define(function() {
    'use strict';

    return function(app) {
        describe('campus book model ', function() {
            var model = app.modelHelper.get('campus_book');

            it("fetch campus book items", function(done) {
                model.request('campus:book:updates').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});