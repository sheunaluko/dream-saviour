/*
Wed Jul  6 04:12:51 PDT 2016
This file defines filters that are applied to text that the user says before it is processed at all by DS
*/


this.DSfilter = {

}

var filter = {
    "dream" : ["Drake"] , 
    "new dream" : ["nutrient" , "New Jersey" , "blue dream"] , 
} 


/*build the DS filter obj*/
for (correctWord in filter) {
    /*loop through all correct words*/
    let options = filter[correctWord]  /*we retrieve the list of alternatives corresponding to the correct word*/
    for (i in options) {
	let alternative = options[i]
	/*loop through and add each alternative to the filter dictionary*/
	DSfilter[alternative] =  correctWord
    }
} 







