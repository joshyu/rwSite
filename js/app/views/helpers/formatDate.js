define(['hbs/handlebars'], function (Handlebars) {
    Handlebars.registerHelper("formatDate",function(datetime, format) {
        var d = new Date(datetime);
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear();
    });
})