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
             it("fetch newest training short list", function(done) {
                model.request('campus:events:training:updates:short').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch userowned training list", function(done) {
                model.request('campus:events:training:userowned', {nameId: 202}).then(function(items) {
                    expect(items).toBeDefined();
                    done();
                });
            });

            it("fetch training item", function(done) {
                model.request('campus:training:item:info', {id: 1}).done(function(item) {
                    expect(item).toBeDefined();
                    expect(item).toBeTruthy();
                    done();
                });
            });

        });
    }
});