define(['require', 
            'models/user' ,
            'models/navigation',
            'models/news',
            'models/links',
            'models/campus_src',
            'models/campus_training',
            'models/campus_survey',
            'models/contacts'
            ],  function (require) {
    'use strict';
    var _cache= {};
    var app= require('app');

    var mfactory=  {
        get: function  (modelName) {
            if(_cache[modelName]){
                return _cache[modelName];
            }

            var _model =  require('models/'+modelName);
            if(!_model  ||  $.type(_model) !== 'function'){
                return false;
            }
            
            return _cache[modelName] = new _model();            
        },

        init: function  () {
            this.reqres = app.reqres;
            this.request = app.reqres.request.bind(this.reqres);
            this.setHandler = app.reqres.setHandler.bind(this.reqres);

            return this;
        }
    };

    app.addInitializer(function() {
        app.modelHelper = mfactory.init();
    });
});