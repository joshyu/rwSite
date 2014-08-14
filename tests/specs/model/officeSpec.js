define(function() {
    'use strict';

    return function(app) {
        describe('campus Office model ', function() {
            var model = app.modelHelper.get('campus_office');

            it("fetch office layout items", function(done) {
                model.request('campus:office:layout').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch product list", function(done) {
                model.request('campus:project:list').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});