define([
    'require',
    'views/NewsPanelView',
    'views/ProfilePanelView',
    'views/QuicklinkPanelView',
    'views/CampusUpdatesPanelView',
    'views/SurveyPanelView',
    'views/NTBirthdayPanelView',
    'views/NTNewHirePanelView'
], function(require) {
    'use strict';
    return {
        layout: function (layoutView) {
              var _regions= layoutView.regions,  _panels= layoutView.panels;
              if(!layoutView || !_regions || !_panels){
                return false;
            }

            for(var key in _regions){
                if(!layoutView[key] || !_panels[key]){
                    continue;
                }

                var viewKey = 'views/'+ _panels[key] + 'PanelView';
                var _view = require(viewKey);
                if(!_view || $.type(_view) !== 'function'){
                    return false;
                }

                layoutView[key].show(new _view());                
            }
        }
    };
});