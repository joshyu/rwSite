define([
    'marionette',
    'app',
     'views/ViewBase',
    'underscore',
    'text!templates/navigation.html',
    'hbs/handlebars'
], function(Marionette, app, ViewBase,  _, partialtemplate, Handlebars) {
    'use strict';
    return ViewBase.extend({
        templateStr : "{{#each navigation}} {{> menuitem}} {{/each}}",
        tagName:"ul",
        options: {
            speed: 300
        },
        className:"nav nav-list",

        ui: {
             "folder" : 'li.menu-folder',
             "leaflink" : ".menu-leaf > a"
        },

        events:{
            "click @ui.folder" : "toggleFolder",
            "click @ui.leaflink" : 'clickMenuItem'
        },

        request: {
            model : 'navigation',
            key: 'navigation:fetch:list',
            dataHandler: 'formatMenuList',
        },

        renderData: function  (data) {
            Handlebars.compile(partialtemplate);
            Handlebars.registerPartial('menuitem', partialtemplate);
            var template = Handlebars.compile(this.templateStr);
            this.$el.html(template(data));

            //highlight the default one.
            this.highlight();
        },

        toggleFolder: function  (e) {
            var $folderNode= $(e.target).parents('li:first');
            if($folderNode.hasClass('menu-folder')){
                var $targetNode=  $folderNode.find('>ul');
                if($folderNode.hasClass('is-open')){
                     $targetNode.slideUp(this.options.speed, function () {
                          $(this).parent('li').removeClass('is-open').find('a:first > i').attr('class', 'fa fa-lg fa-fw fa-folder');
                     });
                }else{
                     $targetNode.slideDown(this.options.speed, function () {
                          $(this).parent('li').addClass('is-open').find('a:first > i').attr('class', 'fa fa-lg fa-fw fa-folder-open');
                     });
                }

            }
        },

        clickMenuItem: function  (e) {
            var link = $(e.target).attr('href');
            if(/^http\:\/\//.test(link)) {
                window.open(link);
            }else{
                this.highlight(e.target);
            }
            return false;
        },

        highlight: function  (dom) {
            var $dom= $(dom).parent('li');
            if(!$dom.length){
                $dom = this.$el.find('> li:first');
            }

            if(this.lastHighlightedDom){
                this.lastHighlightedDom.removeClass('active').parents('li:first').removeClass('active');
            }

            $dom.addClass('active').parents('li:first').addClass('active');
            this.lastHighlightedDom = $dom;
        }

    });
});