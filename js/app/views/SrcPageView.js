define([
    'marionette',
    'app',
    'hbs!templates/profile/layout',
    'views/ListPageBaseView'
], function(Marionette, app, template,  ListPageBaseView) {
    'use strict';

    return ListPageBaseView.extend({
        template: template,
        className:"container profilepage",
        initialize: function(){
            this.on('show', function(){
                app.execute('navigation:dehighlight');
            });

            Marionette.Layout.prototype.initialize.apply(this, arguments);
        },
        regions: {
            empdata : '.panel-emprofile .panel-body',
            srcs:'.panel-src .panel-body',
            trainings: '.panel-training .panel-body'
        },

        panels: {
            empdata: 'EmpItemView',
            srcs: {
                class: 'SrcListView',
                options: {pageId: 'profile'}
            },
            trainings: {
                class: 'TrainingListView',
                options: {pageId: 'profile'}
            }
        },
                
        onRender: function () {
            PanelHelper.layout(this, 'profile');
        }
    });
});