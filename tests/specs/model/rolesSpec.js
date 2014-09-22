define(function() {
    'use strict';

    return function(app) {
        describe('campus roles model ', function() {
            var model = app.modelHelper.get('roles');

            it("fetch user permission for list", function(done) {
                var testcases = {
                    'oliu' : false,
/*                    'hhong' : true,
                    'sdou1' : false,
                    'jyu5' : true*/
                };

                var _dfds = _.map(testcases, function(value, nameId){
                    return app.modelHelper.get('contacts').fetchListPermissionForCurUser("newhire", 'i:0#.w|ra-int\\'+nameId).then(function(res){
                        return !!res == value;
                    });
                });

                $.when.apply($, _dfds).then(function(){
                    _.each(arguments, function(res,i){
                        expect(res).toBeDefined();
                        expect(res).toBeTruthy();
                    });

                    done();
                });
            });
        });
    }
});