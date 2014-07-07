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


            showProfile: function(){
                app.execute('main:showpage', this.viewMap.Profile);
            },

            showHome: function () {
                app.execute('main:showpage', this.viewMap.Home);
            }
        };
    }
);