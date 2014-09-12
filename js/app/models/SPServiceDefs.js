define({
    api: {
        listRelativePath: '/_api/Web/lists/getbytitle(\'$listTitle$\')/items($id$)',
        listRelativePathProperties: '/_api/Web/lists/getbytitle(\'$listTitle$\')/$prop$',
        contextInfo: '/_api/contextinfo/'
    },

    postMethods: {
        'update' : "MERGE",
        'delete'  : "DELETE",
        'create'  : ""
    },

    conditions: {
        keysNeedMapped: {
            "num": "top"
        },

        keysItemPermitted: ["expand"]
    },
    base: {
    },

    user: {
        currentUser: {
            url: '/_api/Web/currentUser',
        },

        currentUserRoles: {
            url: '/_api/Web/GetUserById($id$)/Groups',
        }
    },

    src: {
        categoryNames: {
            url: {
                site: "campus",
                title: "SrcCategory"
            }
        },
        items: {
            url: {
                site: 'campus',
                title: 'Src'
            }
        }
    },

    book: {
        items: {
            url: {
                site: "campus",
                title: "Books"
            }
        }
    },
    survey: {
        items: {
            url: {
                site: "campus",
                title: "SurveyList"
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
                    orderby: 'Id desc'
                },
                filters: 'Visible eq 1' //sharepoint will check the field with 1/0.
            }
        }
    },
    navigation: {
        items: {
            url: {
                site: "campus",
                title: "Sidemenu"
            }
        }
    },
    office: {
        layout: {
            url: {
                site: "campus",
                title: "OfficeLayout"
            }
        },
        products: {
            url: {
                site: "campus",
                title: "Products"
            }
        }
    },
    contacts: {
        items: {
            url: {
                site: 'campus',
                title: 'Contactss',
                name: 'contactss'
            }
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
                title: 'Teams'
            }
        }
    },
    training: {
        items: {
            url: {
                site: 'campus',
                title: 'TrainingList'
            }
        }
    },
    suggestion: {
        items: {
            url: {
                site: 'campus',
                title: 'SuggestionList',
                name: 'SuggestionList'
            }
        },
         mail: {
            url: '/_api/SP.Utilities.Utility.SendEmail'
            //url: '/_vti_bin/client.svc/SP.Utilities.Utility.SendEmail'
        }
    }
});