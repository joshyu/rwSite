define(['marionette', 'underscore', 'app', 'views/HeaderView', 'views/FooterView', 'views/NavigationView'],
    function(Marionette, _, app, HeaderView, FooterView, NavigationView) {

//--------------------------------------------------------------------------------------------------------------------------
// Region base for root layout regions.
//
        var _regionBase = Marionette.Region.extend({
            initialize: function(){
                app.vent.on('app:pace:done',  this._ready,  this);
                this.bindEvents();
                this._show();
            },

            _ready: function(){
                this.$el.removeClass('notready').addClass('ready');
                app.vent.off('app:pace:done', this._ready, this);
            },

            bindEvents: function () {},
            _show:function(view,options) {
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
                    this.show(view,options);
                }
            }
        });



//--------------------------------------------------------------------------------------------------------------------------
// animated region 
//
        var _AnimatedClasses = {
           out : 'notready',
           in : 'ready'
        };

        //TODO : add multiple effects.
        var _AnimationEffects = {
            Slide : 0,
            Drop : 1,
        };

        var _AnimatedRegion = _regionBase.extend({
                duration: 500, /*ms*/

                sleep: function(miniseconds){
                    var dfd= $.Deferred();
                    setTimeout(function(){
                        dfd.resolve(true);
                    }, miniseconds);

                    return dfd.promise();
                },
                show: function(view){
                    if(!this.currentView){
                        Marionette.Region.prototype.show.apply(this, arguments);
                        return;
                     }

                    this.ensureEl();
                    view.render();                    
                    this.closeview(function() {
                          if (this.currentView && this.currentView !== view) { return; }
                          this.currentView = view;
                          this.sleep(this.duration).then( _.bind(function(){
                                this.openview(view, function(){
                                    if (view.onShow){view.onShow();}
                                    view.trigger("show");
                             
                                    if (this.onShow) { this.onShow(view); }
                                    this.trigger("view:show", view);
                              });
                          },this));                          
                    });
                  },

                  bindEvents: function(){
                        var that = this;
                        this.ensureEl();
                        this.$el.on('webkitTransitionEnd transitionend MSTransitionEnd msTransitionEnd oTransitionEnd' , function(){
                            var view = that.currentView;
                            if($(this).hasClass(_AnimatedClasses.out)){
                                if(view.close){ view.close(); }
                                that.trigger("view:closed", view);
                                delete that.currentView;
                                that.trigger('view:out');

                            }else{
                                that.trigger('view:in');
                            }                           
                       });
                  },
                 
                  closeview: function(cb){
                        var view = this.currentView;                     
                        if (!view){
                          if (cb){ cb.call(this); }
                          return; 
                        }
                     
                        var that = this;
                        this.on('view:out', function(){
                            this.off('view:out');
                            cb && cb.call(that);
                        });

                        this.$el.addClass(_AnimatedClasses.out);

                  },
                 
                  openview: function(view, callback){
                    var that = this;
                    this.$el.html(view.$el);

                     this.on('view:in', function(){
                        this.off('view:in');
                        callback && callback.call(that);
                    });

                    this.$el.removeClass(_AnimatedClasses.out);
                  }
        });

        return {
            RootRegionBase: _regionBase,
            AnimatedRegion: _AnimatedRegion,
            Effects : _AnimationEffects
        };
    });

