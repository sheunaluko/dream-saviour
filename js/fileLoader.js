/*
Mon Jul  4 05:46:50 PDT 2016
*/

/*define logger for this file*/
function loaderLog(msg){
	console.log("[fileLoader]~> " + msg) ; 
}

/* 
Define dependencies. Dependencies must reside in /js/
*/ 
const dependencies = [
    "DS", 
    "DSresources",
    "speechCommands",
    "speechParser",
    "renderer" , 
    "dreamCharacteristics",
    "dreamHelper",
    "dreamHelperFilter",
    "DSfilter" 
] 


/*listen for dependencies loaded event and then run the main function*/
function onDependenciesLoaded(){
    loaderLog("All dependencies loaded")
    loadFile("main") 
}
this.addEventListener("dependenciesLoaded" , onDependenciesLoaded) ; 


function loadFile (filename) {
    if (true){ 
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", ("js/" + filename +".js")) 
    }
    if (typeof fileref!="undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref);
	loaderLog(filename + " loaded.") ; 
    } 
}



/*Checks if all of the dependencies are loaded. Assumes that each depenency will load an object into global namespace (by defining this._namespace = {})  which matches its file name! */
var loadedEvent = new Event("dependenciesLoaded") 
function isLoaded(filename) { return this[filename] } ; 
function checkLoaded(dependencies) { 
    /*converts array of deps into array of bools corresponding to load status*/   
  //  loaderLog(dependencies) 
    var loadArray = dependencies.map(isLoaded) 
//    loaderLog(loadArray) 
    /*checks if all are loaded*/
    return loadArray.every((el)=>{return el}) 
} 
/*Recursively calls itself until all files are loaded and then fires dependencies loaded event*/
function waitForDependencies(dependencies, maxTries, callNum){


    if (checkLoaded(dependencies)){ 
	this.dispatchEvent(loadedEvent);
	return 
    }
    /*call this functio again in .25 seconds if max not reached*/
    if (callNum <= maxTries) {
	setTimeout(waitForDependencies, 250, dependencies, maxTries, (callNum + 1)) 
    } else {
	loaderLog("Dependency loading timed out") ; 
    }
}

function loadFiles(dependencies) {

    if (dependencies.length == 0 ) {
	this.dispatchEvent(loadedEvent) 
        return 
    } else {
	dependencies.map(loadFile) ; 
	waitForDependencies(dependencies,10,0) ; 
    } 
} 

/*loading files*/
loadFiles(dependencies) 


/*allow global access to some functionalities */
this.loadFile = loadFile 




