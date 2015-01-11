define([
    'marionette',
    'app',
    'views/ModalBase',
    'hbs!templates/partials/newsitem',
], function(Marionette, app, ModalBase,  template) {
    'use strict';
    return ModalBase.extend({
        bodyTmpl : template,
        className:'modal fade newsitem campus_modal',
        footer: '',
        templateData: {
            contentClass : 'campus-item',
            'modal-class' : 'modal-lg'
        },
        request: {
            model: 'news',
            key: 'campus:news:item',
            getOptions: 'getRequestOption'
        },

        handleData: function(data){
            /*var newsitem = data.news;
            var newsitemAttachments = newsitem.attachments;
            var images = [];
            if(newsitem.isgeneral !== true){
                 newsitem.attachments = _.map(newsitemAttachments, function(item, i){
                     if ( /(bmp|jpg|gif|png)$/.test(item.ServerRelativeUrl.toLowerCase())) {
                        newsitem.imageUrl = item.ServerRelativeUrl;
                    }
                 })
            }*/
            


            return ModalBase.prototype.handleData.apply(this, arguments);
        },

        getRequestOption: function(){
            var itemId= this.options.itemId;
            return {
                id: itemId
            };
        }
    });
});