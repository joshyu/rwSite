define(function() {
    'use strict';

    return function(app) {
        describe('campus contacts model ', function() {
            var model = app.modelHelper.get('contacts');

            it("fetch contact  employee list", function(done) {
                model.request('contacts:fulllist').done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.roots).toBeDefined();
                    expect(items.roots.length).toEqual(1);
                    done();
                });
            });

            it("fetch new hire list", function(done){
                model.request('contacts:newhire').done(function(items){
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            it("fetch contact information", function(done){
                model.request('contacts:contactInfo', {id: 202}).done(function(item){
                    expect(item).toBeDefined();
                    expect(item.relations).toBeDefined();
                    done();
                });
            });

            it("fetch recent birthday list", function(done){
                model.request('contacts:birthday:recently').done(function(items){
                    expect(items).toBeDefined();
                    done();
                });
            });

            it('fetch team category list', function(done){
                model.request('contacts:teamCategoryNames').done(function(items){
                    expect(items).toBeDefined();
                    done();
                });
            })
            
        });
    }
});