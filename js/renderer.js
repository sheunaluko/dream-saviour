/*
Mon Jul  4 22:48:36 PDT 2016
File that uses the renderer templates and actually instanciates them
*/

this.renderer = {} 
renderer.log = function(m) { util.log("renderer" , m) } 
renderer.templates = document.querySelector('link[rel="import"]').import 




renderer.render = function({root , toRender}){
   this.log("rendering") 
    var rt 
    if (root) {
	 rt = document.getElementById(root ) 
    } else {
	/*app is default entry point for rendering*/
	 rt = document.getElementById("app") 
    }
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
    var text = document.createElement("textarea")
    el.appendChild(title) 
    el.appendChild(text)
    return el
}
