define({
    api: {
        listRelativePath: '/_api/Web/lists/getbytitle(\'$listTitle$\')/items($id$)',
        listRelativePath_old: '/_vti_bin/ListData.svc/$listTitle$($id$)'
    },
    conditions: {
        keysNeedMapped: {
            "num": "top"
        },

        KeysWithCompatibilityIssue: ["inlinecount", "skip"]
    },
    base: {

    },
    user: {
        currentUser: {
            url: '/_api/Web/currentUser',
            fields: ['id', 'LoginName', 'Title', 'Email', 'IsSiteAdmin']
        },

        currentUserRoles: {
            url: '/_api/Web/GetUserById(@id)/Groups',
            fields: ['Id', 'Title']
        }
    },

    src: {
        categoryNames: {
            url: {
                site: "campus",
                title: "SrcCategory"

            },
            fields: ['Id', 'Title']
        },
        items: {
            url: {
                site: 'campus',
                title: 'Src',
                conditions: {
                    orderby: 'Id desc',
                    expand: 'Category'
                }
            },
            fields: ['*', 'Category/Title']
        }
    },

    list: {
        contacts: {

        }
    }
});