define(function() {
    'use strict';

    return function(app) {
        describe('campus news model ', function() {
            var model = app.modelHelper.get('news');

            it("fetch news items", function(done) {
                model.request('campus:news:list').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});