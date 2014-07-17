define(['require', 
            'models/user' ,
            'models/navigation',
            'models/news',
            'models/links',
            'models/campus_src',
            'models/campus_training',
            'models/campus_survey',
            'models/contacts',
            'models/suggestion'
            ],  function (require) {
    'use strict';
    var _cache= {};
    var app= require('app');

    var mfactory=  {
        init: function  () {
            this.reqres = app.reqres;
            this.request = app.reqres.request.bind(this.reqres);
            this.setHandler = app.reqres.setHandler.bind(this.reqres);
            return this;
        },

        get: function  (modelName,forceNew) {
            if(!forceNew && _cache[modelName]){
                return _cache[modelName];
            }

            var _model =  require('models/'+modelName);
            if(!_model  ||  $.type(_model) !== 'function'){
                return false;
            }

            var _m = new _model();

            if(!forceNew){
                _cache[modelName] = _m;
            }
            
            return _m;
        }        
    };

    app.addInitializer(function() {
        app.modelHelper = mfactory.init();
    });
});