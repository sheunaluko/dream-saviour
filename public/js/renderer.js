/*
Mon Jul  4 22:48:36 PDT 2016
File that uses the renderer templates and actually instanciates them
*/

this.renderer = {} 
renderer.log = function(m) { util.log("renderer" , m) } 
renderer.templates = document.querySelector('link[rel="import"]').import 


renderer.textHeightLimit = 500

renderer.render = function({root , toRender}){
   this.log("rendering") 
    var rt 
    console.log(rt)
    if (root) {
	 rt = document.getElementById(root ) 
    } else {
	/*app is default entry point for rendering*/
	 rt = document.getElementById("app") 
    }
    console.log(rt) 
    rt.innerHTML = "" 
    rt.appendChild(toRender) 
}

renderer.createInputForm = function(characteristics){
    this.log("Creating input form") 
    var inputContainer = document.createElement("div")     
    for (i=0;i<characteristics.length;i++){ 
	inputContainer.appendChild(this.makeInputUnit(characteristics[i]))
    }
    return inputContainer

}

renderer.makeInputUnit = function(unitObj) {
    var el = document.createElement("div") 
    el.setAttribute("id", unitObj.name)
    var title = document.createElement("p")
    title.innerHTML = unitObj.name 
    var textarea = document.createElement("textarea")
    textarea.oninput = function() {
	textarea.style.height = ""; /* Reset the height*/
	textarea.style.height = Math.min(textarea.scrollHeight, renderer.textHeightLimit) + "px";
    };
    textarea.style.width = "90%"

    el.appendChild(title) 
    el.appendChild(textarea)
    return el
}

renderer.createDreamInputLayout = function() {
    

    /*first the help div*/
    var helpDiv = renderer.templates.getElementById("helpMessage").cloneNode(true)
    helpDiv.style.width = "40%" 
    helpDiv.style.float = "left"

    /*now the input div*/
    var inputDiv = document.createElement("div")
    inputDiv.style.width = "40%"
    inputDiv.style.paddingLeft = "10%"
    inputDiv.style.float = "left" 
    inputDiv.setAttribute("id", "dreamInput") 
    inputDiv.appendChild(renderer.createInputForm(dreamCharacteristics) )

    /*now the layout*/
    var dreamInputLayout = document.createElement("div")
    dreamInputLayout.setAttribute("id" , "dreamInputLaypout")
    dreamInputLayout.appendChild(helpDiv) 
    dreamInputLayout.appendChild(inputDiv)
    return dreamInputLayout
} 

renderer.renderDreamInput = function() {
    toRender = renderer.createDreamInputLayout()
    renderer.render( {toRender } )     
}


