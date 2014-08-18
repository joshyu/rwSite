define(function() {
    'use strict';
    return function(app) {
        describe('user model services', function() {
            var model = app.modelHelper.get('user');
            it('fetch user information', function(done) {
                model.request('user:info').done(function(userData){
                    expect(userData).toBeDefined();
                    done();    
                });                
            });

            it('fetch user role list', function(done){
                model.request('user:role' ,{id: 1} ).done(function(userrole){
                    expect(userrole).toBeDefined();
                    done();
                });
            });

            it("test user information with role", function(done){
                model.request("user:info:role").done(function(userData){
                    expect(userData).toBeDefined();
                    expect(userData.roles).toBeDefined();
                    expect(userData.roles.length).toBeGreaterThan(0);
                    done();
                });
            });

            it('fetch all user related information', function(done){
                model.request('user:all:related').done(function(userData){
                    expect(userData).toBeDefined();
                    expect(userData.info).toBeDefined();
                    expect(userData.info.roles).toBeDefined();
                    expect(userData.info.roles.length).toBeGreaterThan(0);
                    expect(userData.srcData).toBeDefined();
                    expect(userData.trainingData).toBeDefined();
                    done();
                });
            });
        });
    }
});