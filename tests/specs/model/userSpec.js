define(function() {
    'use strict';

    return function(app) {
        describe('user model services', function() {
            var model = app.modelHelper.get('user');

            it('fetchUserInformation', function(done) {
                model.request('user:info').done(function(userData){
                    expect(userData).toBeDefined();
                    expect(userData.info).toBeDefined();
                    //console.log(userData);
                    //expect(userData.srcData).not.toBeNull();
                    //expect(userData.trainingData).not.toBeNull();
                    done();
                });
            });
        });
    }
});