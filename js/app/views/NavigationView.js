define([
    'marionette',
    'app',
    'views/ViewBase',
    'underscore',
    'text!templates/layouts/navigation.html',
    'hbs/handlebars'
], function(Marionette, app, ViewBase, _, partialtemplate, Handlebars) {
    'use strict';
    return ViewBase.extend({
        templateStr: "{{#each navigation}} {{> menuitem}} {{/each}}",
        tagName: "ul",
        options: {
            speed: 300
        },
        className: "nav nav-list",

        ui: {
            "folder": 'li.menu-folder',
            "leaflink": ".menu-leaf > a"
        },

        events: {
            "click @ui.folder": "toggleFolder",
            "click @ui.leaflink": 'clickMenuItem'
        },

        request: {
            model: 'navigation',
            key: 'navigation:fetch:list',
            dataHandler: 'formatMenuList',
        },

        renderData: function(data) {
            Handlebars.compile(partialtemplate);
            Handlebars.registerPartial('menuitem', partialtemplate);
            var template = Handlebars.compile(this.templateStr);
            this.$el.html(template(data));

            app.commands.setHandler('navigation:highlight', this.highlight, this);
            app.commands.setHandler('navigation:dehighlight', this.dehighlight, this);

            this.triggerMethod("render", this);
        },

        toggleFolder: function(e) {
            var $folderNode = $(e.target).parents('li:first');
            if ($folderNode.hasClass('menu-folder')) {
                e.preventDefault();
                var $targetNode = $folderNode.find('>ul');
                if ($folderNode.hasClass('is-open')) {
                    $targetNode.slideUp(this.options.speed, function() {
                        $(this).parent('li').removeClass('is-open').find('a:first > i').attr('class', 'fa fa-lg fa-fw fa-folder');
                    });
                } else {
                    $targetNode.slideDown(this.options.speed, function() {
                        $(this).parent('li').addClass('is-open').find('a:first > i').attr('class', 'fa fa-lg fa-fw fa-folder-open');
                    });
                }
            }
        },

        clickMenuItem: function(e) {
            var linkdom = e.target;
            var href = $(linkdom).attr('href');
            if (!/^http(s)?\:/.test(href)) {
                this.highlight(linkdom);
            }
        },

        dehighlight: function() {
            if (this.lastHighlightedDom) {
                this.lastHighlightedDom.removeClass('active').parents('li:first,li.menu-folder:first').removeClass('active');
            }
        },
        highlight: function(dom) {
            var $dom = null;
            if (_.isString(dom)) {
                if (!/^#/.test(dom)) {
                    dom = '#' + dom;
                }

                $dom = this.$el.find('[href="' + dom + '"]');
            } else {
                $dom = $(dom).parent('li');
            }

            if (!$dom.length) {
                $dom = this.$el.find('> li:first');
            }

            this.dehighlight();
            $dom.addClass('active').parents('li:first, li.menu-folder:first').addClass('active');
            this.lastHighlightedDom = $dom;
        }

    });
});