define([
    'require',
    'views/NewsPanelView',
    'views/ProfilePanelView',
    'views/QuicklinkPanelView',
    'views/CampusUpdatesPanelView',
    'views/SurveyPanelView',
    'views/NTBirthdayPanelView',
    'views/NTNewHirePanelView',
    'views/SuggestionPanelView',
    'views/EmpItemView',
    'views/SrcListView',
    'views/TrainingListView'
], function(require) {
    'use strict';
    return {
        layout: function (layoutView, pageName) {
              var _regions= layoutView.regions,  _panels= layoutView.panels;
              if(!layoutView || !_regions || !_panels){
                return false;
            }

            for(var key in _regions){
                this.show(layoutView, key);             
            }
        },

        append: function (layoutView, key, showOptions ) {
            if(!layoutView || !key ||  !layoutView[key]){
                return false;
            }

            _.extend(showOptions || {}, {preventClose: true});
            _.extend(layoutView[key], {
                open: function(view) {
                    this.$el.append(view.el);
                    if(showOptions.highlighted){
                        this.highlight(view.el);    
                    }                    
                },

                highlight: function(el){
                    if(!el) return false;
                    var $el = $(el);

                    $el.addClass('highlighted');
                    setTimeout(function(){
                        $el.removeClass('highlighted');
                    },500);
                }
            });

            
            this.show(layoutView, key, showOptions);
        },

        show: function(layoutView, key, showOptions){
            var _panels = layoutView && layoutView.panels;
            if(!layoutView || !key ||  !layoutView[key] || !_panels ||  !_panels[key]){
                return false;
            }

            var _panelConf = _panels[key];
            var viewKey = '';
            var options = {};
            var showOptions = showOptions || {};

            if(typeof _panelConf === 'string'){
                viewKey = _panelConf;
            }else if(typeof _panelConf === 'object' && _panelConf.class){
                viewKey = _panelConf.class;
                options = _panelConf.options || {};
                showOptions = _.extend(showOptions, _panelConf.showOptions);
            }


            var _view = require('views/'+ viewKey);
            if(!_view || $.type(_view) !== 'function'){
                return false;
            }

            layoutView[key].show(new _view(options), showOptions);
        },

        update: function  (layoutView, key, showOptions) {
            this.show.apply(this, arguments);
        }
    };
});