define(['marionette', 'app', 'views/RegionTypes'],
    function(Marionette, app, RegionTypes) {
        var _regionBase = RegionTypes.RootRegionBase;
        var _AnimatedRegion = RegionTypes.AnimatedRegion;
        var _regions = {
            header: _regionBase.extend({
                el: '#header',
                view: 'HeaderView'
            }),

            leftNavigation: _regionBase.extend({
                el: '#sidebar',
                view: 'NavigationView'
            }),

            main: _AnimatedRegion.extend({
                el: '#main',
                initialize: function () {
                    _regionBase.prototype.initialize.apply(this, arguments);
                    app.commands.setHandler('main:showpage', this._show, this);
                }
            }),

            footer: _regionBase.extend({
                el: '#footer',
                view: 'FooterView'
            }),
        };

        var LayoutMan= {
            init: function() {
                app.preloader.init().then(app.pace.init).done(function(){
                     app.addRegions({
                        header: _regions.header,
                        main: _regions.main,
                        aside: _regions.leftNavigation,
                        footer: _regions.footer
                    });
                 });               

                this._regionManager =  app._regionManager;
                app.layoutManager = this;
            },

            get: function  (regionName) {
                return this._regionManager.get(regionName);
            },

            showPage: function  (view) {
                this.get('main')._show(view);
            }
        };

        app.addInitializer(function() {
            LayoutMan.init();
        });
        return LayoutMan;
    }
);