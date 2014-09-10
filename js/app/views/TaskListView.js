define([
    'marionette',
    'app',
    'views/ViewBase',
    'hbs!templates/partials/tasklist',
    'bootbox',
    'views/ModalHelper',
], function(Marionette, app, ViewBase, template, bootbox, ModalHelper) {
    'use strict';
    return ViewBase.extend({
        template : template,
        className:'campus-items row',
        loadingHTML: '<img src="images/loading.gif"><div class="loadingmsg"> This will take some time, please wait and take a cup of coffee.</div>',
        noItemsHTML: '<div class="campus-item noresult">No results.</div>',
        events: {
            'click .btn-mark' : 'markdone',
            'click tbody > tr' : 'showItemDetail'
        },

        renderData: function(){
            this.$el.html(this.loadingHTML);
            this.triggerMethod("render", this);
        },

        onRender: function(){
            var that = this;
            var $node = this.$('.count.loading');
            $.when(app.modelHelper.get('user').getUserInCompletedTask()).then(function(data){
                that._templateData = data;

                var html = that.template({
                    list: data,
                    noItemsHTML: that.noItemsHTML
                });
                that.$el.html(html);
            });
        },

        markdone: function(e){
            e.preventDefault();
            var $dom= $(e.target);
            var that = this;

            var id = parseInt($dom.parent().data('item-index'));
            if(isNaN(id)) return false;
            var toSetValue= String(!!(Number($dom.data('val')) || 0));
            var item = this._templateData && this._templateData[id];
            if(!item) return false;
            var _linkName = item.joinLink && item.joinLink.split('/').splice(-2,1);
            if(_linkName && _linkName.length > 0) _linkName = _linkName[0];
            
            app.modelHelper.get('base').markdone({
                id:  item.regId ,
                linkTitle: item.joinLinkTitle,
                linkName: _linkName,
                data: {
                    done: toSetValue
                },                
                success: function(){
                    var $tr= $dom.parents('tr:first').fadeOut('slow', function(){
                        var $tbody = $tr.parent();
                        $tr.remove();
                        if($tbody.find('tr').length === 0){
                            $tbody.parent().fadeOut('slow', function(){
                                that.$el.html(that.noItemsHTML);    
                            });                            
                        }

                        that._templateData.splice(id,1);
                    });
                },
                error: function(){
                    bootbox.alert('Fail to mark current item.');
                }
            });
        },

        showItemDetail: function(e){
            e.preventDefault();
            if(e.target.classList.contains('btn-mark')) return false;

            var $tr = $(e.currentTarget);
            var itemIndex= parseInt($tr.data('item-index'));
            if(isNaN(itemIndex)) return false;
            var item = this._templateData && this._templateData[itemIndex];
            if(!item) return false;

            ModalHelper.get(item.type, {itemId: item.id, domTrigger: $tr[0]}).show();
        }
    });
});