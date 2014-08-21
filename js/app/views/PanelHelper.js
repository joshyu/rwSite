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
    'views/BookListView',
    'views/SurveyListView',
    'views/TrainingListView',
    'views/TrainingPageListView',
    'views/ContactListView',
    'views/OfficeLayoutListView',
    'views/ProjectManListView',
    'views/OrgChartListView'
], function(require) {
    'use strict';
    return {
        layout: function (layoutView, showOptions) {
              var _regions= layoutView.regions,  _panels= layoutView.panels;
              if(!layoutView || !_regions || !_panels){
                return false;
            }

            for(var key in _regions){
                this.show(layoutView, key, showOptions);             
            }
        },

        append: function (layoutView, key, showOptions ) {
            if(!layoutView || !key ||  !layoutView[key]){
                return false;
            }

            _.extend(showOptions || {}, { appendit:  true, preventClose: true});
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
            showOptions = showOptions || {};
            showOptions.preventClose = showOptions.preventClose || 
                                                    (layoutView.templateData && layoutView.templateData.preventClose);

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

            layoutView[key].parentLayer = layoutView;
            layoutView[key].show(new _view(options), showOptions);
        },

        update: function  (layoutView, key, showOptions) {
            this.show.apply(this, arguments);
        }
    };
});