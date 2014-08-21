define([
    'marionette',
    'app',
    'underscore',
    'views/ViewBase'
], function(Marionette, app, _, ViewBase) {
    'use strict';
    return ViewBase.extend({
        bindEvents: function(){
            this.getModel('campus_src').on('noNextUrl', function(){
                this.containerLayer.trigger('removeSeeMoreButton');
            },this);
        }
    });
});