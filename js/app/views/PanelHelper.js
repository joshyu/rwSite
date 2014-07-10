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

        _getSuffix: function(pageName){
            var _suffixes= {
                'main' : 'PanelView'
            };

            return  _suffixes[pageName] || "";
        },

        layout: function (layoutView, pageName) {
              var _regions= layoutView.regions,  _panels= layoutView.panels;
              if(!layoutView || !_regions || !_panels){
                return false;
            }

            var _suffix = this._getSuffix(pageName);
            for(var key in _regions){
                if(!layoutView[key] || !_panels[key]){
                    continue;
                }

                var viewKey = 'views/'+ _panels[key] + _suffix;
                var _view = require(viewKey);
                if(!_view || $.type(_view) !== 'function'){
                    return false;
                }

                layoutView[key].show(new _view());                
            }
        }
    };
});