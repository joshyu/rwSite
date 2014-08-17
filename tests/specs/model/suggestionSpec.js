define(function() {
    'use strict';

    return function(app) {
        describe('campus suggestion model ', function() {
            var model = app.modelHelper.get('suggestion');

            it("post suggestion message", function(done) {
                var data= {
                   receiver : 'campus_manager',
                   Title: 'test',
                   content:'test'
                };

                var posted = {data: data};
                posted.success = function(data){
                    expect(true).toBeTruthy();
                    done();
                }

                //posted.error = function(err){};
                model.execute('suggestion:post', posted);
            });
        });
    }
});