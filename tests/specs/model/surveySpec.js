define(function() {
    'use strict';

    return function(app) {
        describe('campus survey model ', function() {
            var model = app.modelHelper.get('campus_survey');

            it("fetch newest survey list", function(done) {
                model.request('campus:survey:newest').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch hottest survey items", function(done) {
                model.request('campus:survey:popular').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch survey item detail", function(done) {
                model.request('campus:survey:item:info', {id: 1}).done(function(items) {
                    expect(items).toBeDefined();
                    done();
                });
            });            
        });
    }
});