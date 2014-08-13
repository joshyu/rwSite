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
        removedConditions: {
            item: ['orderby', 'top','skip'], 
            list: []
        }

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
                title: "SrcCategory",
                conditions: {
                    expand: 'AttachmentFiles'
                }

            },
            fields: ['Id', 'Title']
        },
        items: {
            url: {
                site: 'campus',
                title: 'Src',
                conditions: {
                    orderby: 'Id desc',
                    expand: 'Category,AttachmentFiles,Author'
                }
            },
            fields: ['*', 'Category/Title','Author/Title']
        },
        item: {
            url: {
                site: 'campus',
                title: 'Src',
                conditions: {
                    expand: 'Category'
                }
            },
            fields: ['*', 'Category/Title']
        }
    },

    book: {
        items: {
            url: {
                site: "campus",
                title: "books",
                conditions: {
                    expand: 'Category'
                }
            },
            fields: ['*', 'Category/Title']
        }
    },
    qlinks: {
        items: {
            url: {
                site: "campus",
                title: "quicklinks"
            }
        }
    },
    news: {
        items: {
            url: {
                site: 'campus',
                title: 'News',
                conditions: {
                    orderby: 'Id desc',
                    expand: 'AttachmentFiles,Author0'
                }
            },
            fields: ['*', 'Author0/Title']
        }
    },
    navigation: {
        items: {
            url: {
                site: "campus",
                title: "sidemenu"
            }
        }
    },
    contacts: {
        items: {
            url: {
                site: 'campus',
                title: 'contacts',
                conditions: {
                    expand: 'FullName,Team0'
                }
            },
            fields: ['*', 'FullName/Title' ,'Team0/Title']
        },
        newhires: {
            url: {
                site: 'campus',
                title: 'NewHires'
            }
        },
        teams: {
            url: {
                site: 'campus',
                title: 'teams'
            }
        }
    }
});