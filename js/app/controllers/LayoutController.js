define(['marionette', 'app', 'views/HeaderView', 'views/FooterView', 'views/NavigationView'],
    function(Marionette, app, HeaderView, FooterView, NavigationView) {
        var _regionBase = Marionette.Region.extend({
            initialize: function(){
                app.vent.on('app:pace:done',  this._ready,  this);
                this.bindEvents();
                this._show();
            },

            _ready: function(){
                this.$el.addClass('ready').removeClass('notready');
                app.vent.off('app:pace:done', this._ready, this);
            },

            bindEvents: function () {},

            _show:function(view) {
                this.ensureEl();
                view = view || this.view;
                
                if(typeof view === 'string'){
                    view = eval('new '+ view +'()');
                }else if(typeof view === 'function'){
                    view = new view();
                }else if(typeof view === 'object'){
                    view = view;
                }

                if(view){
                    this.show(view);
                }
            }
        });

        var _regions = {
            header: _regionBase.extend({
                el: '#header',
                view: 'HeaderView'
            }),

            leftNavigation: _regionBase.extend({
                el: '#sidebar',
                view: 'NavigationView'
            }),

            main: _regionBase.extend({
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
               // app.commands.setHandler('switchPage', this.switchPage, this);  //app.execute('switchPage', 'landingpage');
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