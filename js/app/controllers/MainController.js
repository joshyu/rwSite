define(['app' , 'views/MainView', 'views/ProfileView'],
    function(app, MainView, ProfileView) {
        return {
            routes: {
                "" : "showHome",
                "profile" : "showProfile"
            },

            viewMap: {
                Home : MainView,
                Profile : ProfileView
            },

            init: function() {
                app.router = new Marionette.AppRouter({
                    controller : this,
                    appRoutes  : this.routes
                });

                return app.router;
            },

            showProfile: function(){
                app.execute('main:showpage', this.viewMap.Profile);
            },

            showHome: function () {
                app.execute('main:showpage', this.viewMap.Home);
            }
        };
    }
);