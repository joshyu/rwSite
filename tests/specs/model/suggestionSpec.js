define(function() {
    'use strict';

    return function(app) {
        describe('campus suggestion model ', function() {
            var model = app.modelHelper.get('suggestion');

            xit("post suggestion message", function(done) {
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

                model.execute('suggestion:post', posted);
            });

            xit("post suggestion by sending mail", function(done){
                var data = {
                    'properties': {
                        '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                        'From': 'Site Admin <admin@ra.rockwell.com>',
                        'To': { 'results': ['hhong@ra.rockwell.com', '10340613@qq.com'] },
                        'Subject':  'test by sharepoint',
                        'Body': 'test'
                    }
                };

                var posted = {data: data};
                posted.success = function(data){
                    expect(true).toBeTruthy();
                    done();
                }

                posted.error = function(data){
                    expect(true).toBeTruthy();
                    done();
                }

                model.execute('suggestion:send:mail', posted);
            });
        });
    }
});