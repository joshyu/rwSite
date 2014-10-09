define(['hbs/handlebars'], function (Handlebars) {
    Handlebars.registerHelper("formatDate",function(datetime, format) {
        if(!datetime) return "";
        var d = new Date(datetime);
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' +  d.getFullYear();
    });
})