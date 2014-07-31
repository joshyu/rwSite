define({
    init: function (app) {
        this.app = app;
        this.instance = this.initCtrl();
        this._cachedListeningUsers= {};
        return this;
    },

    isEnabled: function  () {
        return !! this.instance;
    },

    bind: function(view){
        //check all of the names to bind lync icon.
        if(!this.instance || !view || !view.$el) return false;
        this.lyncDoms= [];
        this.domIds = {};
        view.$el.find('.lync-status-container')
            .each(_.bind(this.handleEachLyncDom, this))
            .on('mouseenter', '.lync-status', _.bind(this.onMouseoverDom, this))
            .on('mouseleave', '.lync-status', _.bind(this.onMouseLeaveDom, this))
            .on('click', '.lync-status', _.bind(this.onClickDom,this));
    },

    handleEachLyncDom: function(id, container){
        var $container = $(container).show();
        var _lyncDoms = this.lyncDoms;
        var _dom = _lyncDoms[id] = $container.find('.lync-status'); 
        var usermail = _dom.data('email');
        if(!usermail) return false;      

        usermail = usermail.replace("ra.rockwell.com","rockwellautomation.com");
        _dom.data('email' , usermail);
        this.domIds[usermail] = id;

        var status = this.instance.GetStatus(usermail, 0);
        var lastStatus = this._cachedListeningUsers[usermail];
        if(lastStatus !== void 0){
            if( lastStatus == status ){
                this.onLyncPresenceStatusChange(usermail, status);    
            }else{
                this._cachedListeningUsers[usermail] = status;
            }
            
        }else{
           
        }
    },

    onMouseoverDom: function(e){
        var _dom = $(e.target);
        var usermail = _dom.data('email');
        
        var eLeft = _dom.offset().left;
        var x = eLeft - _dom.scrollLeft();

        var eTop = _dom.offset().top;
        var y = eTop - _dom.scrollTop();

        this.instance.ShowOOUI(usermail, 0, x, y);
    },

    onMouseLeaveDom: function(e){
        this.instance.HideOOUI();
    },

    onClickDom: function(e){
        this.onMouseoverDom(e);
        this.instance.DoAccelerator();
    },

    initCtrl: function(){
        var nameCtrl;
        try {
            if (window.ActiveXObject) {
                nameCtrl = new ActiveXObject("Name.NameCtrl");
            } else {
                nameCtrl = this.createNPApiOnWindowsPlugin("application/x-sharepoint-uc");
            }

            nameCtrl.OnStatusChange = _.bind(this.onLyncPresenceStatusChange, this);
        }
        catch (ex) { nameCtrl = false; }
        return nameCtrl;
    },

    onLyncPresenceStatusChange: function(usermail, status){
        var lyncDomId = this.domIds[usermail];
        var lyncDom = this.lyncDoms[ lyncDomId ];
        if(!lyncDom) return false;

        var presenceClass = this.getLyncPresenceString(status);
        lyncDom.removeClass(this.statuses).addClass(presenceClass);
        console.log(status,presenceClass)
        this._cachedListeningUsers[usermail] = status;
    },

    statuses : 'available offline away inacall busy donotdisturb',

    getLyncPresenceString: function (status) {
        switch (status) {
            case 0:
                return 'available';
                break;
            case 1:
                return 'offline';
                break;
            case 2:
            case 4:
            case 16:
                return 'away';
                break;
            case 3:
            case 5:
                return 'inacall';
                break;
            case 6:
            case 7:
            case 8:
            case 10:
                return 'busy';
                break;
            case 9:
            case 15:
                return 'donotdisturb';
                break;
            default:
                return '';
        }
    },

    isSupportedNPApiBrowserOnWin: function () {
        return true;
    },

    isNPAPIOnWinPluginInstalled: function (pluginName) {
        return Boolean(navigator.mimeTypes) && navigator.mimeTypes[pluginName] && navigator.mimeTypes[pluginName].enabledPlugin
    },

    createNPApiOnWindowsPlugin: function(pluginName) {
        var pluginNode = null;
        if (this.isSupportedNPApiBrowserOnWin()){
            try {
                pluginNode = document.getElementById(pluginName);
                if (!Boolean(pluginNode) && this.isNPAPIOnWinPluginInstalled(pluginName)) {

                    var dom = document.createElement("object");
                    dom.id = pluginName;
                    dom.type = pluginName;
                    dom.width = "0";
                    dom.height = "0";
                    dom.style.setProperty("visibility", "hidden", "");
                    document.body.appendChild(dom);
                    pluginNode = document.getElementById(pluginName);
                }
            } catch (d) {
                pluginNode = null;
            }
        }
            
        return pluginNode;
    }
});