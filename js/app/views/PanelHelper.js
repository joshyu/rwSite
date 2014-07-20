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
                if(!layoutView[key] || !_panels[key]){
                    continue;
                }

                var _panelConf = _panels[key];
                var viewKey = '';
                var options = {};
                var showOptions = {};

                if(typeof _panelConf === 'string'){
                    viewKey = _panelConf;
                }else if(typeof _panelConf === 'object' && _panelConf.class){
                    viewKey = _panelConf.class;
                    options = _panelConf.options || {};
                    showOptions = _panelConf.showOptions || {};
                }


                var _view = require('views/'+ viewKey);
                if(!_view || $.type(_view) !== 'function'){
                    return false;
                }

                layoutView[key].show(new _view(options), showOptions);                
            }
        },

         append: function (layoutView, key ) {
            //this.show
        },

        show: function(layoutView, key){

        }
    };
});