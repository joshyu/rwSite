define(['marionette', 'app', 'views/HeaderView', 'views/MainView', 'views/FooterView', 'views/NavigationView'],
    function(Marionette, app, HeaderView, MainView, FooterView, NavigationView) {
        var _regionBase = Marionette.Region.extend({
            initialize: function(){
                app.vent.on('app:pace:done',  this._ready,  this);
                this._show();
            },

            _ready: function(){
                this.$el.addClass('ready').removeClass('notready');
            },

            _show: function(){
                this.ensureEl();
                var _view= this.view;
                if(!_view && this.vname){
                    _view = eval('new '+ this.vname +'()');
                }

                if(_view){
                    this.show(_view);
                }
            }
        });

        var _regions = {
            header: _regionBase.extend({
                el: '#header',
                vname: 'HeaderView'
         }),

            leftNavigation: _regionBase.extend({
                el: '#sidebar',
                vname: 'NavigationView'
            }),

            main: _regionBase.extend({
                el: '#main',
                vname: 'MainView',
                switchPage: function  (pageId) {
                }
            }),

            footer: _regionBase.extend({
                el: '#footer',
                vname: 'FooterView'
            }),
        };

        var LayoutMan= {
            init: function() {
                app.pace.init().done(function(){
                     app.addRegions({
                        header: _regions.header,
                        main: _regions.main,
                        aside: _regions.leftNavigation,
                        footer: _regions.footer
                    });
                 });               

                this._regionManager =  app._regionManager;
                app.layoutManager = this;
                app.commands.setHandler('switchPage', this.switchPage, this);  //app.execute('switchPage', 'landingpage');
            },

            get: function  (regionName) {
                return this._regionManager.get(regionName);
            },

            switchPage: function  (pageId) {
                this.get('main').switchPage(pageId);
            }
        };

        app.addInitializer(function() {
            LayoutMan.init();
        });
        return LayoutMan;
    }
);