define([
    'marionette',
    'underscore',
    'app',
    'views/ViewBase',
    'views/ModalHelper',
    'hbs!templates/home/campus_update',
], function(Marionette, _, app, ViewBase, ModalHelper, template) {
    'use strict';
    return ViewBase.extend({
        template: template,
        news_count: 13,
        ui: {
            srcLinks : '.list-group-src  .list-group-item',
            /*trainingLinks: '.list-group-training .list-group-item'*/
        },
        events: {
            'click @ui.srcLinks': 'clickLinkItem',
            /*'click @ui.trainingLinks': 'clickTrainingLink',*/
            'click .banner-right .label': 'clickNewsType'
        },

        templateData: {
            title: 'Campus News',
            subtitle_news: 'News and Events',
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
            var _news = [];
            var labelcs = {
                'news' : 'news',
                'campus_src' : 'src',
                'campus_training': 'training'
            };

           // data.news = data.campus_src = null;

            //var _existingLabelcs = {};
            _.each(data, function(items, key){
                if(!items || !items.length) return;
               // _existingLabelcs[key] = labelcs[key];
                _.each(items, function(item){
                   item.type = labelcs[key];
                   item.labelc = labelcs[key][0].toUpperCase();
                });
                _news.push.apply(_news, items);
            });

            _news = _news.sort(function(v1, v2){
                return new Date(v2.pubdate) - new Date(v1.pubdate);
            }).slice(0, this.news_count);

            this._renderData({news: _news, newsTypes: _.values(labelcs)});           
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
        },
        
        clickTrainingLink: function(e){
            var domTrigger= e.currentTarget;
            var itemId= Marionette.$(domTrigger).data('item-id');
            if(itemId){
                ModalHelper.get('training', {itemId: itemId, domTrigger: domTrigger}).show();
            }
            return false;
        },

        clickNewsType: function(e){
            var domTrigger = e.currentTarget;
            var $dom = $(domTrigger);
            $dom.toggleClass('disabled');
            var disabled = $dom.hasClass('disabled');
            var $newsNodes = this.$('.list-group-src a.list-group-item');
            var type = $dom.data('type');
            if(!type || !$newsNodes.length) return false;

            _.each(this.templateData.news, function(item, i){
               if(item.type == type ){
                    $newsNodes.eq(i)[disabled ? 'slideUp' : 'slideDown']('slow');
               }
            });
        }
    });
});