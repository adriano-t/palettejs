
var $ = function( id ) { return document.getElementById( id ); };

function getExtension(filename){
	return filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
}

function CreateFileInput(callback, display)
{
	var finput = document.createElement('input');
	finput.type = "file"; 
	if(!display)
		finput.style.display = "none";  
	finput.onchange = callback;
	return finput;
}

function OnRangeDrag(element, callback){  

	element.addEventListener("mousedown", function(){ 
		this.dragging = true;
		if(callback)
			callback(element); 
	}, false);
	
	window.addEventListener("mouseup", function(){
		element.dragging = false;
	}, false);
	
	window.onmousemove = function(){ 
		if(element.dragging && callback)
			callback(element); 
		
	}
}

function getDateString(separator){

	var currentdate = new Date(); 
	return currentdate.getDate() + separator
		+ (currentdate.getMonth()+1)  + separator
		+ currentdate.getFullYear() + separator  
		+ currentdate.getHours() + separator 
		+ currentdate.getMinutes() + separator
		+ currentdate.getSeconds();
		
}
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

function getBase64Image(imgage) {
    var canvas = document.createElement("canvas");
    canvas.width = imgage.width;
    canvas.height = imgage.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgage, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function SetDivSize(div, x, y, width, height){
	div.style.left = x + "px";
	div.style.top = y + "px";
	div.style.width = width + "px";
	div.style.height = height + "px";
}
Math.clamp = function(x, min, max) {
    return x < min ? min : (x > max ? max : x);
};

window.addEventListener('resize', function() { 
  editor.SetSize();
}, true);


window.addEventListener('load', function() {
  StartEditor();
}, true);

	
window.addEventListener('focus', function() {
});

window.addEventListener('blur', function() {
});


const TO_DEG = 180 / Math.PI;
const TO_RAD = Math.PI / 180;
const PI2 = Math.PI / 2;

function distance(x1, y1, x2, y2){ 
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function directionDeg(x1, y1, x2, y2) {
   return (Math.atan2(y1 - y2, x2 - x1) * TO_DEG + 360 ) % 360;
}

function direction(x1, y1, x2, y2) {
   return Math.atan2(y1 - y2, x2 - x1);
}

function DisableElement(name){
	$(name).style.display='none';
}
function DisableElements(array){
	for(var i=0; i<array.length; i++){
		$(array[i]).style.display='none';
	}
}

function ValidateInt(element, value){
	start = element.selectionStart;
	var str = element.value.replace(/[^0-9]/g, '');
	if(str == "")
		str = 0;
	else
		str = parseInt(str).toString();
	element.value = str;
	element.selectionStart = start;
	element.selectionEnd = start;
	return parseInt(str);
}

function EnableElement(name, type){
	if(type == undefined)
		type = "block";
	$(name).style.display=type;
}
function EnableElements(array, type){
	if(type == undefined)
		type = "block";
		
	for(var i=0; i<array.length; i++){
		$(array[i]).style.display=type;
	}
}
// public method for encoding an Uint8Array to base64
function toBase64 (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}