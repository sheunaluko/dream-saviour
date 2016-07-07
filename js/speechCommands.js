/*
Mon Jul  4 18:24:49 PDT 2016
File for defining the speech commands and their respective actions 
*/ 

this.speechCommands = {

    "are you there" : function() { recognition.speak({"msg" :"yes"}) } , 
    "what do I do" : function() { 
	recognition.speak({"msg" : DSresources["help"]}) 
	speechParser.branchOnInput( 
	    { 
	      "yes" : function(){recognition.speak({"msg" : DSresources["moreHelp"]})},
	      "no"  : function(){recognition.speak({"msg":DSresources["affirmitive"]})} ,
	      "defaultContinue" : function(){recognition.speak({"msg":"please say yes or no"})} ,
	    }
	)
      } ,
    "new dream" : newDream, 
	     

	

} 



function newDream() {
    
    renderer.renderDreamInput() 
    dreamHelper.start() 

}
