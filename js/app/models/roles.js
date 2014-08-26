define([
    'app',
    'backbone',
    'underscore',
     'models/ModelBase',
    'models/SPService',
    './SPServiceDefs'
], function (app, Backbone,  _,  ModelBase, SPService, _SPDefined) {
    'use strict';
    /*
    * the functions are referred from SP.js
    */
    var _PermissionKinds = {
        emptyMask: 0,
        viewListItems: 1,
        addListItems: 2,
        editListItems: 3,
        deleteListItems: 4,
        approveItems: 5,
        openItems: 6,
        viewVersions: 7,
        deleteVersions: 8,
        cancelCheckout: 9,
        managePersonalViews: 10,
        manageLists: 12,
        viewFormPages: 13,
        anonymousSearchAccessList: 14,
        open: 17,
        viewPages: 18,
        addAndCustomizePages: 19,
        applyThemeAndBorder: 20,
        applyStyleSheets: 21,
        viewUsageData: 22,
        createSSCSite: 23,
        manageSubwebs: 24,
        createGroups: 25,
        managePermissions: 26,
        browseDirectories: 27,
        browseUserInfo: 28,
        addDelPrivateWebParts: 29,
        updatePersonalWebParts: 30,
        manageWeb: 31,
        anonymousSearchAccessWebLists: 32,
        useClientIntegration: 37,
        useRemoteAPIs: 38,
        manageAlerts: 39,
        createAlerts: 40,
        editMyUserInfo: 41,
        enumeratePermissions: 63,
        fullMask: 65
    };

    var _PermissionDefs = {
        news: {
            link: '/campus/Lists/News/AllItems.aspx',
            perm: 'editListItems' // if not specified, this is default value.
        }
    }

    var _PermissionUtils = function(obj){
        var high = obj.High || 0;
        var low = obj.Low || 0;
        return {
            hasPermission: function(permkind){
                permkind = Number(permkind) || 0;
                if (!permkind) return true;
                if (permkind === _PermissionKinds.fullMask){
                    return (high & 32767) === 32767 && low === 65535;
                }

                permkind --;
                var b = 1;

                if (permkind >= 0 && permkind < 32) {
                    b = b << permkind;
                    return 0 !== ( low & b);
                } else if (permkind >= 32 && permkind < 64) {
                    b = b << permkind - 32;
                    return 0 !== (high & b);
                }

                return false
            }
        }
    }

    return ModelBase.extend({
        _service: 'roles',
        requests: {
            'roles:list:permission:for:user' : '_fetchListPermissionForUser'
        },

        _fetchListPermissionForUser: function(data){
            _.extend(data, {noPace: true});

            var that = this;
            return this.service['_fetchitem'](data).then(function(res){
                return that._checkPermission(res.GetUserEffectivePermissions, data.perms);
            })
        },

        //dirty code. will be refactored later if possible.
        getEditLinkHtml: function(link){
            return '<div class="pull-right edit-link"><a target="_blank" href="'+ link +'"><i class="fa fa-pencil fa-fw"></i> </a></div>'
        },

        _checkPermission: function(data, perms){
            if(!data || !data.High || !perms) return false;
            var _perm = _PermissionKinds[perms.perm];
            var status= _PermissionUtils(data).hasPermission(_perm);
            return status ? perms.link : false;
        }
    });
});