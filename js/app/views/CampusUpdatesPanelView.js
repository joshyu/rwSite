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
        },
        events: {
            'click @ui.srcLinks': 'clickLinkItem',
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
                options: {num:13}
            },
            {
                model: 'campus_src',
                key: 'campus:events:src:fresh:short',
                options: {num:13}
            },
            {
                model: 'campus_training',
                key: 'campus:events:training:fresh:oneweek:short',
                options: {num:13}
            }            
        ],

        renderData: function(data){
            var _news = [];
            var labelcs = {
                'news' : 'news',
                'campus_src' : 'src',
                'campus_training': 'training'
            };

            //when sorting two items, if pubdate is equal, then the item with lower priority will be placed before.
            var priority = {
                'src' : 0,
                'training' : 1,
                'news' : 2
            };

            _.each(data, function(items, key){
                if(!items || !items.length) return;
                _.each(items, function(item){
                   item.type = labelcs[key];
                   item.labelc = labelcs[key][0].toUpperCase();
                });
                _news.push.apply(_news, items);
            });

            _news = _news.sort(function(v1, v2){
                //return new Date(v2.pubdate) - new Date(v1.pubdate);
                return v1.pubdate !== v2.pubdate ?  ( new Date(v2.pubdate) - new Date(v1.pubdate) ) : ( priority[v1.type] - priority[v2.type] );
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