/*
Mon Jul  4 05:24:48 PDT 2016
This file defines utilities used by js 
*/


this.util = {}; 

/*
This function allows each file (or other entity) to create a custom logger 
that prepends a tag to each log statement. This is useful for debegging 
*/
util.log = function(tag,msg) { 
    console.log("[" + tag + "]~> " + msg);
} 

