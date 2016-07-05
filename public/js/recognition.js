/*
Mon Jul  4 16:20:10 PDT 2016
module for text to speech facility AND speech recognition 


*/

//configure recognition  object
//its import to include this. or else main.js will not be able to find the module 

recognition = new webkitSpeechRecognition()

recognition.continuous = true;   
recognition.interimResults = false;  

recognition.log = function(m) { util.log("recognition" , m) } 

recognition.onstart = function() {
    this.log("Recognition started");
    this.continuous = true 
};

recognition.onend = function() {
    if (recognition.continuous) { 
	recognition.start() 
    } else {
	//do nuttin 
	this.log("exiting") 
    }
}

recognition.end = function () {
    this.log("Recognition ended")
    recognition.continuous = false 
    recognition.stop() 
} 

recognition.onresult = function(event) {


    if (typeof(event.results) === 'undefined') {
	recognition.stop();
	this.log("Result undefined!");	
        return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {      
        if (event.results[i].isFinal) { 
	    //final results are here
	    let result = event.results[i][0].transcript
	    this.log("Result was: " + result)
	    if (speechParser) { 
		speechParser.parse(result.trim())
	    } 
        } else {   
	    //interim results are here
            this.log("Interim result was: " + event.results[i][0].transcript);	    
        } 
    } 
}; 


/*first we define a simple speaker function*/
var sayit = function ()
{

    var msg = new SpeechSynthesisUtterance();
    var voices = speechSynthesis.getVoices() /*femal uk*/
    msg.default = false 
    msg.voice = voices[2]
    msg.onstart = function (t) {
        console.log("[speech]~> started: " + t.utterance.text)
    };
    msg.onend = function() {
        console.log('[speech]~> ended')
    };
    msg.onerror = function(event)
    {

        console.log('Errored ' + event);
    }
    msg.onpause = function (event)
    {
        console.log('paused ' + event);

    }
    msg.onboundary = function (event)
    {
        console.log('onboundary ' + event);
    }

    return msg;
}

recognition.shutdown = function() {
    this.continuous = false 
    this.abort()
}

recognition.init = function() {
    this.continuous = true 
    this.start() 
}

recognition.restart = function() {
    this.shutdown() 
    this.init() 
}


recognition.initOnSpeechEnd = function() {
    setTimeout( function(){ 
	if(!speechSynthesis.speaking) {
	    recognition.init() 
        } else  { 
	    recognition.initOnSpeechEnd() 
        }
    }, 250) 
}




recognition.speak = function ({msg})
{
    speechSynthesis.cancel(); // if it errors, this clears out the error.

    /*stops listening while speaking*/
    recognition.shutdown() 
    var sentences = msg.split(".");
    for (var i=0;i< sentences.length;i++)
    {
        var toSay = sayit();
        toSay.text = sentences[i];
        speechSynthesis.speak(toSay);
    }

    recognition.initOnSpeechEnd() 
	    
	    
}



/*
call speech voices once to change default voice 
*/
recognition.initVoices = function() {
//    this.log("Preparing voice")
    speechSynthesis.getVoices() 
}

recognition.initVoices() 
