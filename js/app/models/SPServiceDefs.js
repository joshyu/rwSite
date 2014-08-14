define({
    api: {
        listRelativePath: '/_api/Web/lists/getbytitle(\'$listTitle$\')/items($id$)',
        listRelativePathProperties: '/_api/Web/lists/getbytitle(\'$listTitle$\')/$prop$',
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
            }
        },
        item: {
            url: {
                site: 'campus',
                title: 'Src',
                conditions: {
                    expand: 'Category,AttachmentFiles,Author'
                }
            }
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
    survey: {
        items: {
            url: {
                site: "campus",
                title: "SurveyList",
                conditions: {
                    expand: 'Author'
                },
                filters: 'available eq 1' //sharepoint will check the field with 1/0.
            }
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
                },
                filters: 'Visible eq 1' //sharepoint will check the field with 1/0.
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
    office: {
        layout: {
            url: {
                site: "campus",
                title: "OfficeLayout",
                conditions: {
                    expand: 'File'
                }
            }
        },
        products: {
            url: {
                site: "campus",
                title: "products",
                conditions: {
                    expand: 'File'
                }
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
            fields: ['*', 'FullName/Title', 'Team0/Title']
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