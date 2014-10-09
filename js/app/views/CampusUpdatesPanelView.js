define([
    'marionette',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/campus_update',
], function(Marionette, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        ui: {
            srcLinks : '.list-group-src  .list-group-item',
            trainingLinks: '.list-group-training .list-group-item'
        },
        events: {
            'click @ui.srcLinks': 'clickLinkItem',
        },

        templateData: {
            title: 'Campus News',
            subtitle_src: 'Latest News',
            subtitle_training: 'Training Center'
        },
        requests: [
            {
                model: 'news',
                key: 'campus:news:list',
                options: {num:5}
            },
            {
                model: 'campus_src',
                key: 'campus:events:src:updates:short',
                options: {num:5}
            },
            {
                model: 'campus_training',
                key: 'campus:events:training:updates:short',
                options: {num:5}
            }            
        ],

        renderData: function(data){
            var _data = [];
            var labelcs = {
                'news' : 'news',
                'campus_src' : 'src',
                'campus_training': 'training'
            };

            _.each(data, function(items, key){
                _.each(items, function(item){
                   item.type = labelcs[key];
                   item.labelc = labelcs[key][0].toUpperCase();
                });
                _data.push.apply(_data, items);
            });

            _data = _data.sort(function(v1, v2){
                return new Date(v2.pubdate) - new Date(v1.pubdate);
            });

            this._renderData({data: _data});           
        },

        clickLinkItem: function(e){
            //pop up modal dialog.
            var domTrigger= e.currentTarget;
            var $dom = Marionette.$(domTrigger);
            var itemId= $dom.data('item-id');
            var itemType = $dom.data('type');
            if(itemId && itemType){
                ModalHelper.get(itemType, {itemId: itemId, domTrigger: domTrigger}).show();
            }
            return false;
        }
    });
});