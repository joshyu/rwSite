define(['hbs/handlebars'], function (Handlebars) {
    Handlebars.registerHelper("formatDate",function(datetime, format) {
        if(!datetime) return "";
        var d = new Date(datetime);
        var m = d.getMonth() + 1;
        var day = d.getDate();
        var year = d.getFullYear();

        if(String(m).length == 1) m='0'+m;
        if(String(day).length == 1) day = '0'+day;

        return m + '/' + day + ( format.hash.year !== false ? ' / ' +  year : "" );
    });
})