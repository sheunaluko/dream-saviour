/*
Mon Jul  4 16:20:10 PDT 2016
module for text to speech facility AND speech recognition 


*/

//configure recognition  object
//its import to include this. or else main.js will not be able to find the module 

recognition = new webkitSpeechRecognition()

recognition.continuous = true;   
recognition.interimResults = true;  

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
	    recognition.giveFeedback(result) 
	    if (speechParser) { 
		speechParser.parse(result.trim())
	    } 
        } else {   
	    //interim results are here
	    recognition.giveFeedback("Processing...") 
        } 
    } 
}; 


recognition.giveFeedback = function(result) {
    var el = document.getElementById("feedback") 
    el.value = result 
}



recognition.findVoice = function(URI) {

    var voices = speechSynthesis.getVoices() 
//    console.log(voices) 
    for (i in voices) {
	var voice  = voices[i].voiceURI
//	console.log(voice)
	if (URI == voice) {
	    this.log("Found voice: " + URI)
	    return i
        }

    }

    this.log("Voice not found: " + URI)
    return false 
}

recognition.voiceOrder = ["Google UK English Female" , "Google US English" , "Google UK English Male"  ] 
recognition.useVoice = null 

recognition.selectVoice = function() {
    for (i in recognition.voiceOrder ) {
	if (recognition.findVoice ( recognition.voiceOrder[i]) ){
	  /*so we found a voice that was in our list!*/
	    recognition.voiceIndex = i
	    return 
	}
   } 

   /*no voices matched!*/
   recognition.log("No voices matched") 
   
}



/*first we define a simple speaker function*/
var sayit = function ()
{

    var msg = new SpeechSynthesisUtterance();
    //var voices = speechSynthesis.getVoices()
    recognition.selectVoice() 
    var voice = speechSynthesis.getVoices()[recognition.voiceIndex] 
    msg.voice = voice

    msg.onstart = function (t) {
        console.log("[speech]~> started: " + t.utterance.text)
        console.log("[speech]~> voice: " + voice.voiceURI)
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




/*not for the tts stuff*/
/*
call getVoices once because for some reason the first call returns empty array!? 
*/
recognition.initVoices = function() {
//    this.log("Preparing voice")
    speechSynthesis.getVoices() 
}
recognition.initVoices() 

