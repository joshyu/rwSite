define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/traininglist',
    'bootbox'
], function(Marionette, app, ViewBase, template, bootbox) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'panel-src-list campus-items row',

        events: {
            'click .btn-markdone' : 'markdone'
        },

        getTemplateData: function(){
            var opts = {
               campus_training : app.preloaded.user.trainingData
            };

            this._templateData = opts.campus_training;

            if(this.options.pageId == 'profile'){
                opts.noJoinLink = true;
            }

            opts.curUser = app.preloaded.user.info.name;
            return opts;  
        },

        onRender: function(){
            this.$el.find('.trcode-link').popover();
        },

        markdone: function(e){
            e.preventDefault();

            bootbox.prompt('please input training code:', function  (trcode) {
                if( trcode !== null ){
                    var data = {formData: {trcode : trcode}}
                    app.modelHelper.get('campus_training').execute('campus:events:training:checktrcode',{data: data}, success: function (stat) {
                        if(stat){
                            bootbox.confirm("Training code is correct. Are you sure to mark it done ?", function (res) {
                                if(res){
                                    var item= e.target;
                                    var itemId = $(item).data('item-id');
                                    var data = {formData: {id : itemId , trcode : trcode } };

                                    app.modelHelper.get('campus_training').execute('campus:events:training:markdone',{data: data, success: function(status){
                                         if(status){
                                            var $grp = $(item).parents('.btn-group:first');
                                            $grp.fadeOut('slow', function(){
                                                var $urlDom = $grp.children().first().html('open').css('opacity', 0);
                                                $grp.replaceWith($urlDom[0]);
                                                $urlDom.animate({opacity:1}, 'slow');
                                            });
                                         }
                                    }});
                                }
                            })
                        }
                    })
                }
            });            
        }
    });
});