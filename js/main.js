var editor = null; 
  
function StartEditor(){ 
	new Editor();
	   
}
function Editor()
{ 
	editor = this;
	this.saved = true;
	
	this.DOMcolors = []; 
	
	this.SetSize = function(){
		var windowWidth = window.innerWidth - 5;
		var windowHeight = window.innerHeight - 5;
		
		this.areaW = ((windowWidth-5)/4*3 - 5);
		this.areaH = (windowHeight-5);
		
		this.centerX = this.areaW / 2;
		this.centerY = this.areaH / 2;
		
		this.div = $("EditorDiv");
		this.div.padding = "0px";
		this.div.style.width = this.areaW + "px";
		this.div.style.height = this.areaH + "px";
		
		optWidth = Math.max(330, (windowWidth-5)/4) ;
		this.divOpt = $("Options");
		this.divOpt.style.padding = "5px";
		this.divOpt.style.width = optWidth -10 + "px";
		this.divOpt.style.height = (windowHeight-5 - 8) + "px"; 
		this.divOpt.style.left = windowWidth - optWidth - 6 +"px" 
		
		var helpW = windowWidth*3/4;
		var helpH = windowHeight*4/5;
		
		SetDivSize($("help"), (windowWidth - helpW)/2, (windowHeight - helpH)/2, helpW, helpH);
		SetDivSize($("winPalette"), (windowWidth - helpW)/2, (windowHeight - helpH)/2, helpW, helpH);
		
		SetDivSize($("blackContainer"), 0, 0,  windowWidth, windowHeight);
	}
	this.SetSize();
	
	this.canvas = $("mainCanvas");
	this.ctx = this.canvas.getContext("2d");
	if(!this.ctx){
		alert("Your browser does not support HTML5 Canvas");
	}
	 
	//backup canvas
	this.bCanvas = document.createElement("canvas");
	this.bCtx = this.bCanvas.getContext("2d");
	
	
	this.changingColor = undefined;
	
	jscolor.callbackClose = function(){
		$("colorPicker").style.display = "none";
	}
	
	$("inputPicker").onchange = function(){
		var el = editor.changingColor;
		if(el){
			var s = this.color.toString();;
			el.style.backgroundColor = "#"+s
			
			var rgb = hexToRgb(s); 
			el.color = [rgb.r, rgb.g, rgb.b];
			editor.palette[editor.DOMcolors.indexOf(el)] = [rgb.r, rgb.g, rgb.b];
		}
	}
	
	this.baseTexture = undefined;
	this.paletteList = [];
	this.paletteId = 1;
	var strList = localStorage["paletteList"];
	if(strList && strList.length > 2)
	{	 
		this.paletteList = JSON.parse(strList);
		
		var lastPalette = parseInt(localStorage["lastPalette"]);
		if(lastPalette)
			this.paletteId = lastPalette;
		else if(paletteList[0])
			this.paletteId = paletteList[0];
		this.palette = JSON.parse(localStorage["palette"+this.paletteId]);
		
		if(!this.palette)
			this.palette = [];	 
	}
	else
	{
		console.log("palette not found");
		//this.palette = [[155,209,255],[223,255,255],[255,218,56],[132,157,127],[200,246,254],[238,225,218],[191,233,115],[190,171,94],[211,236,241],[143,215,29],[129,125,93],[184,219,240],[218,182,204],[28,216,94],[185,164,23],[181,211,210],[181,172,190],[26,196,84],[192,202,203],[231,96,228],[43,192,30],[213,178,28],[148,133,98],[185,194,195],[249,52,243],[56,150,97],[255,156,12],[157,157,107],[174,145,214],[73,120,17],[235,150,23],[153,131,44],[152,171,198],[141,137,223],[84,100,63],[227,125,22],[170,120,84],[128,133,184],[110,140,182],[239,90,50],[160,118,58],[170,171,157],[98,95,167],[144,195,232],[219,71,38],[151,107,75],[144,144,144],[124,175,201],[208,80,80],[128,128,128],[104,100,126],[131,162,161],[239,141,126],[140,101,80],[107,132,139],[103,98,122],[125,191,197],[216,152,144],[145,81,85],[106,107,118],[104,86,84],[91,169,169],[196,96,114],[146,81,68],[88,105,118],[92,68,73],[181,62,59],[142,66,66],[66,84,109],[97,200,225],[192,30,30],[62,82,114],[107,92,108],[78,193,227],[134,22,34],[150,67,22],[57,85,101],[109,90,128],[93,127,255],[128,26,52],[76,74,83],[107,68,99],[56,121,255],[141,56,0],[68,68,76],[140,58,166],[11,80,143],[128,44,45],[131,79,13],[62,61,52],[57,48,97],[125,55,65],[73,51,36],[53,44,41],[43,40,84],[0,0,200],[36,36,36]]
		this.palette = [[61,45,80],[61,45,80],[89,80,96],[7,8,36],[34,0,74],[114,101,104],[255,255,255],[54,36,44],[72,55,58],[154,117,147],[250,239,202],[224,153,130],[26,50,75],[31,58,86],[45,68,92],[56,81,108],[99,93,140],[88,29,118],[146,38,144],[174,64,153],[192,83,119],[210,91,105],[254,254,254]]
		this.paletteList.push(this.paletteId); 
		localStorage["lastPalette"] = 1; 
		localStorage["palette"+this.paletteId] = JSON.stringify(this.palette); 
		localStorage["paletteList"] = JSON.stringify(this.paletteList); 
	}
	
	$("apply").onclick = function(){
		editor.Apply();
	};
	
	$("ramp").onclick = function(){
		editor.Ramp();
	};
	 
	$("newPalette").onclick = function(){ 
		if(editor.saved || confirm("Unsaved changes will be lost, continue?")) 
			editor.ClearPalette();
	}
	
	$("loadPalette").onclick = function(){
		if(editor.saved || confirm("Unsaved changes will be lost, continue?")){
			editor.LoadPalette();
		}
	}
	
	
	$("savePalette").onclick = function(){
		
		console.log("savePalette clicked");
		editor.SavePalette();
		editor.saved = true;
	}
	 
	$("generatePalette").onclick = function(){  
		editor.ClearPalette(); 
		generatePalette();
	}
	
	 
	 
	$("showHelp").onclick = function(){
		EnableElements(["help", "blackContainer"]);
	}
	 
	var btnLoadTexture = CreateFileInput(function(){
		editor.OnChangeFile(this);
	});
	
	$("loadTexture").onclick = function()
	{
		btnLoadTexture.click();
	}
	 
	this.LoadPalette = function()
	{
		var l = $("paletteList");
		l.innerHTML = "";
		var div = document.createElement("div");
		l.appendChild(div);
		var rows = 6;
		var columns = 7;
		
		for(var n in this.paletteList)
		{
			var pal = JSON.parse(localStorage["palette"+this.paletteList[n]]);
				
			var c = CreateCanvas(16*columns, 16*rows);
			var canvas = c.canvas;
			canvas.paletteId = this.paletteList[n];
			canvas.className = "palette-preview";
			var ctx = c.context;
			
			canvas.palette = pal;
			canvas.onclick = function()
			{
				editor.ClearPalette();
				editor.palette = this.palette;
				localStorage["lastPalette"] = this.paletteId;
				updatePalette();
				
				DisableElements(["winPalette", "blackContainer"]);
			}
			
			canvas.oncontextmenu = function(e){
				e.preventDefault(); 
				canvas.parentNode.removeChild(this);
				localStorage.removeItem('palette'+this.paletteId);
				editor.paletteList.splice(editor.paletteList.indexOf(this.paletteId), 1);
				localStorage["paletteList"] = JSON.stringify(editor.paletteList);
				if(editor.paletteId == this.paletteId)
				{
					localStorage["lastPalette"] = editor.paletteList[0];
				}
				
				
			}
			
			
			var x=0, y=0;
			for(var i in pal)
			{
				
				var col = pal[i];
				ctx.fillStyle = "#"+rgbToHex(col[0],col[1],col[2]);
				ctx.fillRect(x*16, y*16, 16, 16);
				
				x++;
				if(x >= columns)
				{
					x = 0;
					y++;
				}
				if(y>=rows)
					break;
				
			}
			div.appendChild(canvas);
		}
		
		
		EnableElements(["winPalette", "blackContainer"]); 
	}
	
	this.SavePalette = function()
	{
		console.log("palette length: "+this.palette.length);
		if(this.palette.length <= 0 )
			return;
		 
		console.log("this.paletteId: "+this.paletteId);
		if(this.paletteId <= 0)
		{
			var id = 1;
			for(var i in this.paletteList)
			{
				if(this.paletteList[i] == id)
					id++;
				else
					break;
			}
			this.paletteId = id;
			this.paletteList.push(this.paletteId); 
		}
		
		console.log("paletteList: ",this.paletteList);
		localStorage["lastPalette"] = this.paletteId; 
		localStorage["palette"+this.paletteId] = JSON.stringify(this.palette); 
		localStorage["paletteList"] = JSON.stringify(this.paletteList); 
	
	}
	
	this.OnChangeFile = function(element){ 
	 
		for(var i=0; i<element.files.length; i++){
			var file = element.files[i]; 
			
			var reader = new FileReader();
			reader.name = file.name;
			 
			reader.onload = function(){
			
				var extension = this.name.substr(this.name.lastIndexOf('.') + 1).toLowerCase();
 
				if(extension == "png" || extension  == "jpg"  || extension  == "jpeg"  || extension  == "bmp" ){
					 var img = new Image();
					img.src = this.result;
					
					editor.baseTexture = img;
					editor.canvas.width = img.width;
					editor.canvas.height = img.height;
					editor.ctx.drawImage(img, 0, 0);
					
					editor.bCanvas.width = img.width;
					editor.bCanvas.height = img.height;
					editor.bCtx.drawImage(img, 0, 0);
					
					//render in the canvas
					
				}
				
			};
			reader.readAsDataURL(file);
		}
	}  
	    
	this.Ramp = function()
	{
		var palette = this.palette;
		this.canvas.width = 512;
		this.canvas.height = 512;
		var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		var w = imgData.width;
		var h = imgData.height;
		var data = imgData.data; 
		
		for(var y = 0; y < h; y++){
			yw = y * w;
			ywD = (y+1) * w; 
			for(var x = 0; x < w; x++){
				
				var i = (x + yw) * 4;
				
				var b = (Math.floor(x/64) + Math.floor(y/64) * 8) * 4;
				
				// RGB
				pixelSet(data, i, [(x%64)/64 * 255, (y%64)/64 * 255, b, 255]);
				var i = (x + yw) * 4;
				var oPx = pixelGet(data, i); 
				
				var nPx = nearestColor(oPx, palette); 
				pixelSet(data, i, [nPx[0], nPx[1], nPx[2], 255]);
				
			}
		}
		this.ctx.putImageData(imgData,0,0);
	}
	
	this.Apply = function(){ 
		this.ctx.drawImage(this.bCanvas, 0, 0); 
		console.log(this.palette)
		var palette = this.palette;
		var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		var w = imgData.width;
		var h = imgData.height;
		var data = imgData.data; 
		
		
		for(var y = 0; y < h; y++){
			yw = y * w;
			ywD = (y+1) * w; 
			for(var x = 0; x < w; x++){
				
				var i = (x + yw) * 4;
				
				//var b = (Math.floor(x/64) + Math.floor(y/64) * 8) * 4;
				
				// RGB
				//pixelSet(data, i, [(x%64)/64 * 255, (y%64)/64 * 255, b, 255]);
				
				// HSV
				//pixelSet(data, i, HSVtoRGB((x%64)/64,(y%64)/64, Math.floor(x/64)/64 + Math.floor(y/64)/64 * 8	));
				
				
				var i = (x + yw) * 4;
				var oPx = pixelGet(data, i); 
				
				var nPx = nearestColor(oPx, palette); 
				pixelSet(data, i, [nPx[0], nPx[1], nPx[2], 255]);
				
				
				/*
				var dPx = colorDifference(oPx, nPx);
				var i1 = (x+1 + yw) * 4;
				pixelAdd(data, i1, colorMultiply(dPx, 7/16));
				
				var i2 = (x-1 + ywD) * 4;
				pixelAdd(data, i2, colorMultiply(dPx, 3/16));
				
				var i3 = (x + ywD) * 4;
				pixelAdd(data, i3, colorMultiply(dPx, 5/16));
				
				var i4 = (x+1 + ywD) * 4;
				pixelAdd(data, i4, colorMultiply(dPx, 1/16));	
				*/
			} 
		}
		
		/*
		for(var y = 0; y < h; y++)
		{
			col = y * w; 
			ywD = (y+1) * w; 
			for(var x = 0; x < w; x++)
			{
				var i = (x + col) * 4;
				var oPx = pixelGet(data, i); 
				var nPx = nearestColor(oPx, palette);
				 
				pixelSet(data, i, [nPx[0], nPx[1], nPx[2], oPx[3]]); 
				var dPx = colorDifference(oPx, nPx);
				 
			} 
		}
		*/
		
		console.log("Applied!");
		this.ctx.putImageData(imgData,0,0);
	}
	
	this.ClearPalette = function()
	{
		editor.saved = true;
		
		editor.DOMcolors = [];
		editor.palette = [];
		editor.paletteId = -1;
			
		var cont = $("paletteContainer");
		cont.innerHTML = "";
		
		//add button
		var el = document.createElement("span");
		el.className = "icon-add";
		el.onclick = function()
		{
			addColor([128, 128, 128]);
			editor.palette.push([128, 128, 128]);
		} 
		cont.appendChild(el);
		
	}
	   
	updatePalette();
}


function updatePalette()
{ 
	var len = editor.palette.length;
	for(var i=0; i<len; i++)
	{
		var c2 = editor.palette[i];
		addColor(c2);
		
	}
}

function addColor(c)
{
	var cont = $("paletteContainer");
	var el = document.createElement("span");
	el.className = "icon-color";
	el.color = [c[0], c[1], c[2]];
	el.style.backgroundColor = "rgb("+c[0]+","+c[1]+","+c[2]+")";
	editor.DOMcolors.push(el);
	
	el.oncontextmenu = function(e)
	{
		e.preventDefault(); 
		var index = editor.DOMcolors.indexOf(this);
		editor.DOMcolors.splice(index, 1);
		editor.palette.splice(index, 1);
		this.parentNode.removeChild(this);
	}
	
	el.onclick = function(e)
	{  
		var p = $("colorPicker");
		var ip = $("inputPicker");
		p.style.display = "block";
		ip.color.fromRGB(this.color[0]/255, this.color[1]/255, this.color[2]/255)
		ip.focus();
		editor.changingColor = this;
	}
	cont.appendChild(el);	
}


function sortPalette()
{
	 
	var len = editor.palette.length;
	for(var i=0; i<len; i++)
	{
		var j = i;
		while(j > 0 ){
			
			var c1 = editor.palette[j-1];
			var hsv1 = colorHSV(c1);
			
			var c2 = editor.palette[j];
			var hsv2 = colorHSV(c2); 
			var s1 = c1[0]+c1[1]+c1[2];
			var s2 = c2[0]+c2[1]+c2[2];
			//if(c1[0]+c1[1]+c1[2]  > c2[0]+c2[1]+c2[2])
			//if(c1[0]+c1[1]*120+c1[2]*250  > c2[0]+c2[1]*120+c2[2]*250)
			//if(hsv1[0] + hsv1[0]/hsv1[1]*0.2  + hsv1[0]/hsv1[2]*0.5 >  hsv2[0] + hsv2[0]/hsv2[1]*0.2 + hsv2[0]/hsv2[2]*0.5 )
			//if(
			//	s1/20 + s1*hsv1[0]*5 + s1*((hsv1[0]<0.5)?100:0) + s1*hsv1[2]*hsv1[2]*10>
			//	s2/20 + s2*hsv2[0]*5 + s2*((hsv2[0]<0.5)?100:0) + s2*hsv1[2]*hsv1[2]*10)
			//{
			
			if(hsv1[0] * 100 + hsv1[1] * 100 + hsv1[2] * 100 > hsv2[0] * 100 + hsv2[1] * 1000000 + hsv2[2] * 10)
			{
				editor.palette[j-1] = c2;
				editor.palette[j] = c1;			
			}
			j--;
		}
	}
	
}
 
function sortPaletteHSV(palette)
{
	 
	var len = palette.length;
	for(var i=0; i<len; i++)
	{
		var j = i;
		while(j > 0 ){
			
			var c1 = palette[j-1];
			var hsv1 = colorHSV(c1);
			
			var c2 = palette[j];
			var hsv2 = colorHSV(c2);
			
			if(hsv1[0] == hsv2[0])
			{
				if(hsv1[2] > hsv2[2] )
				{
					palette[j-1] = c2;
					palette[j] = c1;			
				}
			}
			
			if(hsv1[0] > hsv2[0] )
			{
				palette[j-1] = c2;
				palette[j] = c1;			
			}
			
			j--;
		}
	}
	
	for(var i=0; i<len; i++)
	{
		var c1 = palette[i]; 
	}
	
}

function colorHSV(c){
	var hue = 0;
	var saturation = 0;
	var r = ( c[0] / 255 );
	var g = ( c[1] / 255 );
	var b = ( c[2] / 255 );

	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var diff = max - min; 
	var value = max;
	
	if(diff == 0)
		return [hue, saturation, value];
	 
	var saturation = diff / max

	del_R = ( ( ( max - r ) / 6 ) + ( diff / 2 ) ) / diff
	del_G = ( ( ( max - g ) / 6 ) + ( diff / 2 ) ) / diff
	del_B = ( ( ( max - b ) / 6 ) + ( diff / 2 ) ) / diff
	
	if ( r == max ) hue = del_B - del_G
	else if ( g == max ) hue = ( 1 / 3 ) + del_R - del_B
	else if ( b == max ) hue = ( 2 / 3 ) + del_G - del_R
	else hue = 0;
	
	if ( hue < 0 ) hue += 1;
	if ( hue > 1 ) hue -= 1;
	
	return [hue, saturation, value];

}

function generatePalette()
{ 
	var imgData = editor.ctx.getImageData(0, 0, editor.canvas.width, editor.canvas.height);
	
	var w = imgData.width;
	var h = imgData.height;
	var data = imgData.data; 
	var palette = [];
	for(var y = 0; y < h; y++)
	{
		col = y * w; 
		for(var x = 0; x < w; x++)
		{
			var i = (x + col) * 4;
			var oPx = pixelGet(data, i);
			if(!colorExists(palette, oPx))
				palette.push([oPx[0],oPx[1],oPx[2]]);
		} 
	}
	editor.palette = palette;
	updatePalette();
}

function colorExists(palette, c1){
	var len = palette.length;
	for(var i=0; i<len; i++)
	{
		var c2 = palette[i];
		if(c1[0] == c2[0] && c1[1] == c2[1] && c1[2] == c2[2])
			return true;
	} 
	return false;
}


function dither(imgData, amount){
	
	var w = imgData.width;
	var h = imgData.height;
	var data = imgData.data;
	
	for(var y = 0; y < h; y++){
		yw = y * w;
		ywD = (y+1) * w; 
		for(var x = 0; x < w; x++){
			var i = (x + yw) * 4;
			var oPx = pixelGet(data, i);
			var nPx = colorReduce(oPx, amount);
			var dPx = colorDifference(oPx, nPx);
			pixelSet(data, i, nPx);
			
			var i1 = (x+1 + yw) * 4;
			pixelAdd(data, i1, colorMultiply(dPx, 7/16));
			
			var i2 = (x-1 + ywD) * 4;
			pixelAdd(data, i2, colorMultiply(dPx, 3/16));
			
			var i3 = (x + ywD) * 4;
			pixelAdd(data, i3, colorMultiply(dPx, 5/16));
			
			var i4 = (x+1 + ywD) * 4;
			pixelAdd(data, i4, colorMultiply(dPx, 1/16));	
		} 
	}
	editor.ctx.putImageData(imgData,0,0);
}


colorDifference = function(c1, c2){
	return [
	c1[0] - c2[0],
	c1[1] - c2[1],
	c1[2] - c2[2],
	255
	];
}

valueDifference = function(c1, c2){
	return Math.abs(c1[0] - c2[0])+
	Math.abs(c1[1] - c2[1])+
	Math.abs(c1[2] - c2[2]);
}


hsvDifference = function(c1, c2){
	var hsv1 = colorHSV(c1);
	var hsv2 = colorHSV(c2);
	return Math.abs(hsv1[2] - hsv2[2]) * 0.6 + Math.abs(hsv1[1] - hsv2[1]) * 0.2 + Math.abs(hsv1[0] - hsv2[0]) * 0.2;
	//return Math.abs((hsv1[0] + hsv1[0]/hsv1[1]*0.2  + hsv1[0]/hsv1[2]*0.5) - (hsv2[0] + hsv2[0]/hsv2[1]*0.2  + hsv2[0]/hsv2[2]*0.5)) 
}


function nearestColorCielab(col, palette){

	len = palette.length;
	min = palette[0];
	minValue = labDistance(col, min);
	console.log(minValue)
	for(var i=1; i<len; i++)
	{
		var d = labDistance(col, palette[i]);
		if(d < minValue)
		{
			minValue = d;
			min = palette[i];
		}
	}  
	return min; 
}


function nearestColor(col, palette){

	len = palette.length;
	min = palette[0];
	minValue = valueDifference(col, min);
	for(var i=1; i<len; i++)
	{
		var d = valueDifference(col, palette[i]);
		if(d < minValue)
		{
			minValue = d;
			min = palette[i];
		}
	}  
	return min; 
}


pixelSet = function(data, i, c){
	data[i  ] = c[0];
	data[i+1] = c[1];
	data[i+2] = c[2];
	data[i+3] = c[3];
}

pixelGet = function(data, i){
	return [
	data[i  ],
	data[i+1],
	data[i+2],
	data[i+3]
	];
}

pixelReduce = function(data, i, a){
	return [
	Math.floor(data[i]/a)*a,
	Math.floor(data[i+1]/a)*a,
	Math.floor(data[i+1]/a)*a,
	Math.floor(data[i+1]/a)*a
	];
}

colorReduce = function(c, a){
	return [
	Math.floor(c[0]/a)*a,
	Math.floor(c[1]/a)*a,
	Math.floor(c[2]/a)*a,
	255
	];
}

colorValue = function(c)
{
	return c[0]+c[1]+c[2];
}



colorMultiply = function(c, val){
	return [
	c[0] * val,
	c[1] * val,
	c[2] * val,
	c[3]
	]
}

pixelMultiply = function(data, i, g){
	data[i  ] *= g;
	data[i+1] *= g;
	data[i+2] *= g;
	data[i+3] = 255;
}

pixelAdd = function(data, i, c){
	data[i  ] += c[0];
	data[i+1] += c[1];
	data[i+2] += c[2];
	data[i+3] += c[3];
}

pixelGradient = function(data, i, c1, c2, g){
	data[i  ] = Math.lerp(c1[0], c2[0], g);
	data[i+1] = Math.lerp(c1[1], c2[1], g);
	data[i+2] = Math.lerp(c1[2], c2[2], g);
	data[i+3] = 255;
}


Math.lerp = function(a, b, t){
	return (1-t)*a + t*b;
}

function HSVtoRGB(h, s, v)
{
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) 
	{
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return  [Math.round(r * 255),  Math.round(g * 255), Math.round(b * 255), 255];
}

rgbToHex = function(r,g,b) { 
	return (
		(0x100 | r).toString(16).substr(1) +
		(0x100 | g).toString(16).substr(1) +
		(0x100 | b).toString(16).substr(1)
	);
};


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

  
function rgb2lab(r, g, b) 
{
    var X, Y, Z, fx, fy, fz, xr, yr, zr;
    var Ls, as, bs;
    var eps = 216.0 / 24389;
    var k = 24389.0 / 27;

    var Xr = 0.964221;  // reference white D50
    var Yr = 1.0;
    var Zr = 0.825211;

    // RGB to XYZ
    r = r/255; //R 0..1
    g = g/255; //G 0..1
    b = b/255; //B 0..1

    // assuming sRGB (D65)
    if (r <= 0.04045)
        r = r/12;
    else
        r = Math.pow((r + 0.055) / 1.055, 2.4);

    if (g <= 0.04045)
        g = g/12;
    else
        g =  Math.pow((g + 0.055) / 1.055, 2.4);

    if (b <= 0.04045)
        b = b/12;
    else
        b = Math.pow((b + 0.055)/1.055, 2.4);


    X =  0.436052025 * r + 0.385081593 * g + 0.143087414 * b;
    Y =  0.222491598 * r + 0.71688606  * g + 0.060621486 * b;
    Z =  0.013929122 * r + 0.097097002 * g + 0.71418547  * b;

    // XYZ to Lab
    xr = X / Xr;
    yr = Y / Yr;
    zr = Z / Zr;

    if ( xr > eps )
        fx =  Math.pow(xr, 1/3.0);
    else
        fx = (k * xr + 16.) / 116.0;

    if ( yr > eps )
        fy =  Math.pow(yr, 1/3.0);
    else
		fy = (k * yr + 16.) / 116.0;

    if ( zr > eps )
        fz =  Math.pow(zr, 1/3.0);
    else
        fz = (k * zr + 16.) / 116.0;

    Ls = ( 116 * fy ) - 16;
    as = 500 * (fx - fy);
    bs = 200 * (fy - fz);

	return [2.55 * Ls + 0.5, as + 0.5, bs + 0.5];
} 

function labDistance(a, b)
{ 
	a = rgb2lab(a[0], a[1], a[2]);
	b = rgb2lab(b[0], b[1], b[2]);
	var x = (b[0] - a[0]);
	var y = (b[1] - a[1]);
	var z = (b[2] - a[2]);

	return x*x + y*y + z*z;
}

function distance(a, b)
{
	var x = (b[0] - a[0]);
	var y = (b[1] - a[1]);
	var z = (b[2] - a[2]);
	return x*x + y*y + z*z;
	
}
 


