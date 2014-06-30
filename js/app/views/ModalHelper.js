define([
    'marionette',
    'views/SrcItemModal'    
], function(Marionette, SrcItemModal) {
    'use strict';
    var _modalMap = {
        items:{
             src : SrcItemModal
        }
    };

    return {
        /* modalKey: src, training,survey
        real modal class: SrcItemModal */
        getItem: function (modalKey,options) {
             var _modalClass= _modalMap.items[modalKey];
             if(_modalClass){
                return new _modalClass(options);
             }
        },

        //by default we only support item display in modal dialog.
        get: function(modalKey,options){
            return this.getItem(modalKey,options);
        }
    };
});