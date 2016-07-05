/*
Mon Jul  4 18:30:45 PDT 2016
File for parsing the user input and figuring out what to do with it 
*/

this.speechParser = {} 
speechParser.log = function(msg) { util.log("speechParser" , msg) } 

speechParser.parse = function(text) { 

    /*check if we are processing branch*/
    if ( DS.branchOnInput ) { 
	this.log("Processing branch point")
	this.processBranch(text) 
	return 
    } 

    /*check if command is interacting*/
    if (! DS.cmdInteracting) { 
	/*attempt to find cmd in the speechCommands object*/

	if (speechCommands[text] ) {
	    /*such a command exists, lets call it! */
	    //this.log(speechCommands[text]) 
	    this.log("found command: " + text) 
	    speechCommands[text]() ;
        } else {
	    msg = "command unrecognized"
	    recognition.speak({msg}) 
        } 

    } else {
	/*do something*/

    } 

} 

/*Following function allows external code to give the parser some code to run depending on what the user says. A decision tree is provided and the code corresonding to what is said will be run. For example, this can be used to respond to a yes/ no question, by providing the code corresponding to the "yes" , "no" , and "default" keys of the decision tree dictionary*/
speechParser.branchOnInput = function( decisionTree ) {
    this.log("Processing branch point")
    DS.branchOnInput = true 
    DS.decisionTree = decisionTree 
} 

speechParser.processBranch = function(text) {
    /*first look up text in the decision tree*/
    if (DS.decisionTree[text]) {
	/*exists so call the function... BUT FIRST! we must refresh the branching
	state so that the next function call also call branchOnInput if it wants to*/
	/*first save a reference to the function we need to call so it is not lost 
	by the refresh*/
	var toCall = DS.decisionTree[text] 
	this.refreshBranching() ; 
	toCall() 
    } else {
	/*no match, so we check if there is a default - if not we just end*/
	if (DS.decisionTree["defaultContinue"] ) {
	    var toCall = DS.decisionTree["defaultContinue"] 
	    toCall() 
	} else if (DS.decistionTree["default"]) { 
	    var toCall = DS.decisionTree["default"] 
	    this.refreshBranching() ; 
	    toCall() 
        } else {
	    util.log("No results for decision tree. Ignoring");
	    this.refreshBranching(); 
        } 

    } 
}

speechParser.refreshBranching = function() {
    DS.branchOnInput = false 
    DS.decisiontree = null 
    this.log("Finished branch point") 
} 
