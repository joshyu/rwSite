define(['hbs/handlebars'], function (Handlebars) {
    //refer to http://stackoverflow.com/a/18676885
    Handlebars.registerHelper("ifCond",function(v1,operator,v2,options) {
        if( !options ){
            options = v2;
            v2 = operator;
            operator = '===';
        }
        
        switch (operator){
            case "==":
                return (v1==v2)?options.fn(this):options.inverse(this);
            case "!=":
                return (v1!=v2)?options.fn(this):options.inverse(this);
            case "===":
                return (v1===v2)?options.fn(this):options.inverse(this);
            case "!==":
                return (v1!==v2)?options.fn(this):options.inverse(this);
            case "&&":
                return (v1&&v2)?options.fn(this):options.inverse(this);
            case "||":
                return (v1||v2)?options.fn(this):options.inverse(this);
            case "<":
                return (v1<v2)?options.fn(this):options.inverse(this);
            case "<=":
                return (v1<=v2)?options.fn(this):options.inverse(this);
            case ">":
                return (v1>v2)?options.fn(this):options.inverse(this);
            case ">=":
             return (v1>=v2)?options.fn(this):options.inverse(this);
            default:
                return eval(""+v1+operator+v2)?options.fn(this):options.inverse(this);
        }
    });
})