define(['app'],
    function(app) {
        return {
            init: function (region) {
                this.region = region;
                app.commands.setHandler('main:showpage', this.showpage, this);
            },

            showpage: function (vname){
                                
            }
        }
    }
);