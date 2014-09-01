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

            it("fetch new hire list", function(done) {
                model.request('contacts:newhire',{month:3, least:3}).done(function(items) {
                    expect(items).toBeDefined();
                    expect(items.length).toBeGreaterThan(0);
                    done();
                });
            });

            xit("fetch contact information", function(done) {
                model.request('contacts:contactInfo', {
                    id: 202
                }).done(function(item) {
                    expect(item).toBeDefined();
                    expect(item.relations).toBeDefined();
                    done();
                });
            });

            xit("fetch recent birthday list", function(done) {
                model.request('contacts:birthday:recently').done(function(items) {
                    expect(items).toBeDefined();
                    done();
                });
            });

            xit('fetch team category list', function(done) {
                model.request('contacts:teamCategoryNames').done(function(items) {
                    expect(items).toBeDefined();
                    done();
                });
            });

            xit('update contact photo link', function(done) {
                model.request('contacts:fulllist').done(function(items) {
                    var _dfds = [];
                    var dfd = null;
                    var j=0, i=0;
                    _.each(items, function(_item) {                        
                        var img = _item.photo && _item.photo.replace('http://apcndaeslweb/employeepic', 'http://apcndae-dzn493x/campus/employeepic');
                        if(!img) return;

                        var data = {Photo:{Url: img }};
                        var posted = {
                            id : _item.id,
                            data: data
                        };

                        posted.success = function(data) {
                            j++;
                            if(i == j){
                                
                            }else{
                                                             
                            }
                        }

                        model.execute( 'contacts:updatelink' , posted);
                        i++;
                    });

                    expect(1).toBeDefined();
                    done();                    
                });
                
            });

        });
    }
});