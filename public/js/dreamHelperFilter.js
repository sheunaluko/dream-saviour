/*
Wed Jul  6 04:12:19 PDT 2016
This file defines filters that are applied to text that the user says before it is sent to the dream filter 
*/



this.dreamHelperFilter = {

} 

var filter = {
    "finish" : ["spanish"] , 
    "quit" : ["quick"] , 
    "new"  : ["you" , "knew" ] , 

} 


/*build the filter obj*/
for (correctWord in filter) {
    /*loop through all correct words*/
    let options = filter[correctWord]  /*we retrieve the list of alternatives corresponding to the correct word*/
    for (i in options) {
	let alternative = options[i]
	/*loop through and add each alternative to the filter dictionary*/
	dreamHelperFilter[alternative] =  correctWord
    }
} 

