/*
Tue Jul  5 08:27:08 PDT 2016
File for walking you through the dream recording 
*/


this.dreamHelper = {} 

dreamHelper.init = function() {
    this.currentCharacteristic = false
    this.currentTextArea = null 
    this.whichDone = [] 
    this.saved = false 
}

dreamHelper.init() 

dreamHelper.log = function(m) {util.log("dreamHelper", m)}

dreamHelper.start = function() {
    this.init()
    /*indicate program state*/
    DS.state.name = "inputDream" 
    /*initialize dream helper sate*/
    for (n in dreamCharacteristics) {
	dreamHelper.whichDone.push(false) /*all are not done*/
    }

    /*so we start with the first characteristic*/
    var characteristic = dreamCharacteristics[0]
    dreamHelper.processCharacteristic(characteristic) 
 
}

dreamHelper.processCharacteristic = function(characteristic) {
    var msg = characteristic.query
    recognition.speak({msg})
    /*check if multi*/
    if (characteristic.multi) {
	dreamHelper.log("Processing multi characterisitic")
	dreamHelper.goToCharacteristic(characteristic) /*wait for user input after this to determine what to do */
	return 
    } else {
	/*we have non multi char*/
	dreamHelper.log("Processing NON multi characterisitic")
	if (! characteristic.options ) {
	    dreamHelper.log("Error: options unspecified for non multi characteristic") ; 
	    return 
	} else {
	    /*need to set a branch point... if the user says an accepted answer then we add it to the text area 
	    dreamHelper.goToCharacterstic(characteristic) ; dreamHelper.appendTo..(answer) ; dreamHelper.finish() 
	     if they say an unaccpet answer then we tell them the options and the branch continues */
	    
	    /*we actually need to dynamically create this branch object now using the options field of the characteristic*/
	    var branchObj = {} 
	    /*define a function creator that makes a function that returns a specified string*/
	    var getFunction = function(strang,characteristic) { return function() { 
		dreamHelper.goToCharacteristic(characteristic)
		dreamHelper.appendToCurrentTextArea(strang) 
		dreamHelper.finish()
		}
	    }	
	    for (i in characteristic.options ){
		var option = characteristic.options[i] 
		var opt_function = getFunction(option, characteristic)
		/*set the branch obj val*/
		branchObj[option] = opt_function 
	    }
	    /*now we set the default case*/
	    var toSay = characteristic.options.join(" or ")
	    var msg = "Please say " + toSay 
	    branchObj.defaultContinue = function(){recognition.speak({msg})} 			

	    /*launch the branch point!*/
	    speechParser.branchOnInput(branchObj)
	    
        } 
	    
    }


} 


/*analyzes the input coming from the user to determine what action to take. The default case 
is to append to the current text area, however there are certain key words the user can say
These are: 
switch (followed by the userTag)
save
finish (to  indicate that user is done with given characteristic)
quit (to throw away all data) and end dream input 
*/
dreamHelper.parseInput = function(rawText) {
    /*REMEMBER TO USE ALL LOWER CASE IN SPEECH COMMANDS!*/
    if (rawText == "are you there") {
	var msg = "yes"
        recognition.speak({msg})
	/*respeak query*/
	setTimeout( function() { 
	    var msg = dreamHelper.currentCharacteristic.query
	    if (msg) { recognition.speak({msg}) } 
	   } , 1000)
	return
    } 


    var words = text.split(" ")
    if( words.length < 3 ) {
	/*we only apply filter if 1 or 2 words present (user is giving a command) */
	text = speechParser.filter({"text":rawText, "filterDict" : dreamHelperFilter});
	dreamHelper.log(rawText + " filtered to: " + text)
        var words = text.split(" ")
    } 

    var firstWord = words[0]
    var rest = words[1]
    //var rest = words.splice(1).join(" ") [maybe later when there can be more than two words
    switch (firstWord) {
	case "switch" : {
	    var characteristic = dreamHelper.searchByTag(rest)
	    if (!characteristic) {
		recognition.speak({"msg" : "Please repeat"})
	    } else {
		/*we recognized the tag*/
		dreamHelper.processCharacteristic(characteristic) 
	    }
	    break; 

	   } 
	case "save" : {
	    /*basically going to store a stringified json blob of key value pairs*/
	    this.save() 
	    break; 
	   } 
	case "new" : {
	    /*check if the data has already been saved*/
	    if (this.saved) { 
		/*yes*/
		dreamHelper.restart() 
	    } else {
                /*no */
		var msg = "Would you like to save first?"
		recognition.speak({msg})
		branchObj = {
		    "yes" : function() { 
			dreamHelper.save() 
			dreamHelper.restart() 
			},
		    "no" : function() { dreamHelper.restart() },
		    "defaultContinue" : function() {recognition.speak({"msg" : "Please say yes or no"})}
		    }
		speechParser.branchOnInput( branchObj ) 
	    }
	    break; 

	   } 

	case "quit" : {
	    dreamHelper.init() 
	    renderer.renderDreamInput() /*this clears the current data*/
            DS.state.name = "default" 
	    var msg = "quitting"
	    recognition.speak({msg}) 
	    break; 
	   } 
	case "finish" : {
	    this.finish()
	    break; 
	    }

	default : { 
	    /*no special words so we append to current text area*/
	    dreamHelper.appendToCurrentTextArea(text)
	    var msg = "continue"
	    recognition.speak({msg})	    
	    break ; 
	   }
    }
}
	    

dreamHelper.finish = function() {

	    /*user is finished with given characteristic*/
	    /*we must mark this one is being done now*/
	    dreamHelper.whichDone[dreamHelper.currentIndex] = true 
            this.log("Finished with: " + this.currentCharacteristic.name) 

	    /*we will look for the next unfinished characteristic and process that one*/
	    /*if all are finished, then we will ask user if she wants to save*/
	    var next = dreamHelper.getNextUnfinished() /*returns an index! */
	    if (! (next == "done") ) {
		/*go to the next characteristic*/
		dreamHelper.processCharacteristic(dreamCharacteristics[next]) 
	    } else {
		/*all are done, lets ask to save? */
		var msg = "Should we save this dream?"
		recognition.speak({msg})
		speechParser.branchOnInput(
		    {
			"yes" :  function() { dreamHelper.save() } , 
			"no"  :  function() { recognition.speak({"msg":"ok"}) } , 
			"defaultContinue" : function(){recognition.speak({"msg":"please say yes or no"})}
		    }
		)
	    }


}	   

dreamHelper.save = function() {

	    var toSave = {} 
	    var currTime = (new Date() ) 
	    for (i in dreamCharacteristics){
		currChar = dreamCharacteristics[i] 
		toSave[currChar.name] = dreamHelper.getTextOfCharacteristic(currChar)
	    }
            localStorage[currTime] = JSON.stringify(toSave) 
	    this.saved = true 
	    var msg = "Dream saved"
	    recognition.speak({msg})


}


dreamHelper.restart = function() {
    renderer.renderDreamInput()
    dreamHelper.start() 
}


dreamHelper.searchByTag = function(tag) {
    for (i in dreamCharacteristics) {
	ch = dreamCharacteristics[i] 
	if (ch.name.toLowerCase() == tag) { 
	    return ch
	}
    }
    /*no match */
    dreamHelper.log("no tag match found") 
    return null 
}

dreamHelper.indexOfCharacteristic = function(characteristic) {
    for (i in dreamCharacteristics) {
	ch = dreamCharacteristics[i] 
	if (ch == characteristic ) { 
	    return i
	}
    }
    return "none" 

} 

dreamHelper.getNextUnfinished = function() {
    
    dreamHelper.log("Checking finished array: " + dreamHelper.whichDone) 
    for (i in dreamHelper.whichDone) { 
	if (!dreamHelper.whichDone[i]) { 
	    return i
	} 
    } 

    return "done" 
    
}


dreamHelper.goToCharacteristic = function(characteristic) {
    this.currentCharacteristic = characteristic
    this.currentIndex = this.indexOfCharacteristic(characteristic) 
    /*grab reference to the text area*/
    this.currentTextArea = document.getElementById(characteristic.name).querySelector("textarea")
    if (!this.currentTextArea) { dreamHelper.log ("ERROR: could not locate text area for: " + characteristic.name) }
}

dreamHelper.appendToCurrentTextArea = function(toAppend) {
    this.currentTextArea.value = this.currentTextArea.value + toAppend + ". "
    this.currentTextArea.oninput() 
} 

dreamHelper.getTextOfCharacteristic = function(characteristic) {
    return document.getElementById(characteristic.name).querySelector("textarea").value
}



