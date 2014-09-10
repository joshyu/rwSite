({
    appDir:"./",
    baseUrl: 'js/app',
    dir:"dist",
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: "standard", //.keepLines",
    fileExclusionRegExp: /\.git/,
    mainConfigFile:"js/main.js",
    wrapShim: true,
    modules: [
        {
            name: '../main'
        }
    ]
})