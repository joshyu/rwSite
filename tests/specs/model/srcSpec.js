define(function() {
    'use strict';

    return function(app) {
        describe('campus src model ', function() {
            var model = app.modelHelper.get('campus_src');

            it("fetch campus src category list", function(done) {
                model.request('campus:src:categoryNames').done(function(srcCats) {
                    expect(srcCats).toBeDefined();
                    expect(srcCats.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch campus src items", function(done) {
                model.request('campus:events:src:updates').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch campus src item info", function(done){
                model.request('campus:src:item:info', {id : 2}).done(function(item){
                    expect(item).toBeDefined();
                    done();
                });
            });

             it("fetch campus src item count", function(done) {
                model.request('campus:events:src:count').done(function(item) {
                    expect(item).toBeDefined();
                    expect(item).toBeGreaterThan(0);
                    done();
                });
            });
        });
    }
});