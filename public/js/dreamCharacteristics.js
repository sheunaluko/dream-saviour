/*
Mon Jul  4 23:08:36 PDT 2016
This file defines which characteristics of the dream we would like to save! 
*/

this.dreamCharacteristics = [
    /*note that the user tag is how the user can 
     refer to this characteristic through voice
    (must say edit *tag*)*/
    {
	"name"  : "Title",
	"query" : "What is the title" ,
	"multi" : true 
    }, 
    {
	"name"  : "Description",
	"query" : "Tell me about the dream" ,
	"multi" : true 
    }, 
    {
	"name"  : "Tag",
	"query" : "Please add some tags to this dream" ,
	"multi" : true 
    }, 
    {   
	"name" : "Lucid",
	"query" : "was it lucid?",
	"multi" : false ,
	"options" : ["yes" , "no" ] /*characteristic that are not multi 
				     must supply what options they support 
				    for their value*/
    },
    {   
	"name"  : "Sign" ,
	"query" : "Please list the dream sign categories" ,
	"multi" : true ,
    }, 

]
