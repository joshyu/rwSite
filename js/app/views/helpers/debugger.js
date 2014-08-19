define(['hbs/handlebars'], function (Handlebars) {
    Handlebars.registerHelper("debugger",function(context) {
        console.log(context);
    });
})