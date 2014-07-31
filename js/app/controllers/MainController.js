define(['app' , 'module', 'require', 'marionette', 'backbone', 'underscore', 
      'views/MainView', 'views/ProfileView', 'views/SrcPageView', 'views/BookPageView', 'views/TrainingPageView', 'views/SurveyPageView', 'views/ContactPageView', 'views/OfficeLayoutPageView','views/ProjectManPageView', 'views/OrgChartPageView', 'views/plugins/lync'],
    function(app, module, require, Marionette, Backbone,  _,   MainView, ProfileView, SrcPageView, BookPageView, TrainingPageView, SurveyPageView, ContactPageView, OfficeLayoutPageView, ProjectManPageView, OrgChartPageView) {
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
                "campus/projects" : ProjectManPageView,
                "campus/orgchart" : OrgChartPageView
            },

            init: function() {
                app.router = this.initRouter();
                app.plugins = this.loadplugins();
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
            },

            loadplugins: function(){
                var _conf = module.config();
                var _pluginBasePath = _conf.pluginBasePath;
                var _pluginDefs = _conf.plugins;
                var _plugins= {};

                if(!_pluginBasePath || !_pluginDefs || !_pluginDefs.length) return false;

                _.each(_pluginDefs, function(pluginName){
                    var _pluginClass = require( _pluginBasePath + "/" + pluginName );
                    if(!_pluginClass) return false;

                    _plugins[pluginName] = _pluginClass.init(app);
                });
                

                return _plugins;
            }
        };
    }
);