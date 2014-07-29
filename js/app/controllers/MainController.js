define(['app' , 'marionette', 'backbone', 'underscore', 
      'views/MainView', 'views/ProfileView', 'views/SrcPageView', 'views/BookPageView', 'views/TrainingPageView', 'views/SurveyPageView', 'views/ContactPageView', 'views/OfficeLayoutPageView','views/ProjectManPageView'],
    function(app, Marionette, Backbone,  _,   MainView, ProfileView, SrcPageView, BookPageView, TrainingPageView, SurveyPageView, ContactPageView, OfficeLayoutPageView, ProjectManPageView) {
        return {
            routes: {},
            pageRouter: {
                "" :  MainView ,
                "profile" : ProfileView,
                "campus/src" : SrcPageView,
                "campus/books" : BookPageView,
                "campus/trainings" : TrainingPageView,
                "campus/surveys" : SurveyPageView,
                "campus/employees" : ContactPageView,
                "campus/officeLayout" : OfficeLayoutPageView,
                "campus/projects" : ProjectManPageView
            },

            init: function() {
                app.router = this.initRouter();
                return app.router;
            },

            initRouter: function(){
                var _router = new Marionette.AppRouter({
                    controller : this,
                    appRoutes : this.routes
                });

                var that = this;
                _.each(this.pageRouter, function(v,k){
                    _router.route(k, '_handleViewRouter',  _.bind( that['_handleViewRouter'], that, v ) );
                });

                return  _router;
            },

            _handleViewRouter: function(){
                var view = arguments[0];
                var parms = [].slice.call(arguments,1);
                if(!view || !_.isFunction(view)) return false;

                app.execute('navigation:highlight' , Backbone.history.getFragment());
                app.execute('main:showpage' , view);
            }
        };
    }
);