define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/home/news',
    'views/ModalHelper'
], function(Marionette, app, ViewBase,  template, ModalHelper) {
    'use strict';
    return ViewBase.extend({
        template: template,
        request: {
            model: 'news',
            key: 'campus:news:list'
        },

        events: {
            'click .viewfull' : 'viewFull'
        },

        templateData: {
            title: 'Campus News'
        },

        onRender: function () {
            var that = this;
            this.setViewFullButtons();
             var _carousl= this.$el.find('.carousel').carousel({interval: 10000});
            _carousl.on('slid.bs.carousel', function(){
                that.setViewFullButtons();
            });

            app.modelHelper.get('news').fetchListPermissionForCurUser().then(function(link){
                if(link){
                    that.$el.prepend(app.modelHelper.get('roles').getEditLinkHtml(link));
                }
            }); 
        },

        setViewFullButtons: function(){
            var $active = this.$el.find('.carousel .item.active .news-content');
            if(!$active || $active.length === 0) return false;
            if($active.prev().find('.viewfull').length > 0) return false;

            var item = $active[0];
            var sh = item.scrollHeight; // scrollheight
            var lh = parseFloat($(item).css('line-height'));  //lineheight
            var hh = item.offsetHeight;  //height
            var index = Number($active.data('item-index'));

            if(sh > hh){
                //hh = sh- Math.ceil((sh - hh)/ lh) * lh;  //new height;
                hh = Math.floor(hh / lh) * lh;
                $(item).css('height', hh+'px');                
                $(item.previousElementSibling).append('<a href="#" class="viewfull" data-item-id="'+ index +'">View Full</a>');

            }
        },

        viewFull: function(e){
            var link= e.target;
            var newsIndex= Number($(link).data('item-id'));
            e.preventDefault();

            if(isNaN(newsIndex)) return false;
            var newsInfo = this._templateData.news[newsIndex];
            if(!newsInfo) return false;

            ModalHelper.get('news', {data: newsInfo, isLarge: true}).show();
        }
    });
});