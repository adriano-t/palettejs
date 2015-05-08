var editor = null; 
  
function StartEditor(){ 
	editor = new Editor();
	   
}

function Editor(){  
	//working area 
	   
	this.baseTexture = undefined;
	
	this.projectSaved = true; 
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
		
		//$("output").style.width = (optWidth -25)  + "px";
		
		var helpW = windowWidth*3/4;
		var helpH = windowHeight*4/5;
		
		SetDivSize($("help"), (windowWidth - helpW)/2, (windowHeight - helpH)/2, helpW, helpH);
		
		SetDivSize($("blackContainer"), 0, 0,  windowWidth, windowHeight);
		
		
		  
	}
	this.SetSize();
	
	this.canvas = $("mainCanvas");
	this.ctx = this.canvas.getContext("2d");
	if(!this.ctx){
		alert("Your browser does not support HTML5 Canvas");
	}
		
	$("apply").onclick = function(){
		editor.Apply();
	};
	
	
	
	$("newProject").onclick = function(){
		if(editor.projectSaved || confirm("Unsaved changes will be lost, continue?")){
			editor.ClearProject();
		}
	}
	
	var btnLoadProject = CreateFileInput(function(){
		editor.LoadProject(this);
		this.value = '';
	});
	$("loadProject").onclick = function(){
		if(editor.projectSaved || confirm("Unsaved changes will be lost, continue?")){
			btnLoadProject.click(); 
		}
	}
	
	var btnLoadTexture = CreateFileInput(function(){
		editor.OnChangeFile(this);
	});
	$("loadTexture").onclick = function()
	{
		btnLoadTexture.click();
	}
	 
	this.LoadProject = function(element){ 
		this.ClearProject();
		for(var i=0; i<element.files.length; i++){ 
			
			var file = element.files[i];  
			
			var reader = new FileReader();
			reader.name = file.name; 
			reader.onload = function(){  
				if(getExtension(this.name) == "zip"){
					
					var zip = new JSZip(this.result);
					
					var projFile = zip.files["project.agp"];
					var data = JSON.parse(projFile.asText());
					
					for(var j=0; j<data.length; j++){
						var sprInfo = data[j];
						
						var sprite = editor.AddSprite(sprInfo.name);
						sprite.width = sprInfo.width;
						sprite.height = sprInfo.height;
						sprite.borderLeft = sprInfo.borderLeft;
						sprite.borderTop = sprInfo.borderTop;
						sprite.borderRight = sprInfo.borderRight;
						sprite.borderBottom = sprInfo.borderBottom; 
				
						for(var k=0; k<sprInfo.subimages.length; k++){
							var imageName = "images/"+sprInfo.subimages[k]+".png"; 
							//image and rect for the atlas
							var img = new Image(); 
							img.src = "data:image/png;base64,"+toBase64(zip.files[imageName].asUint8Array());
							 
							var rect = new Rect(img);
							rect.sprite = sprite;
							sprite.rects.push(rect); 
							sprite.container.appendChild(PreviewImage(sprite, img.src, imageName));
							
						}
						
					}
					
					
					/*
					for(var entryName in zip.files){
						entry = zip.files[entryName];
						var ext = getExtension(entryName);
						if(ext == "png"){
							var img = new Image();
							img.src = "data:image/png;base64,"+toBase64(entry.asUint8Array());
							
						}
						
					} 
					*/ 
				}else{
					console.log("wrong format");
				}
			}
		};
		reader.readAsBinaryString(file);
	}
	
	
	$("saveProject").onclick = function(){
		
		var zip = new JSZip();
		 
		var fid = getDateString("_");
		
		var data = [];
		var id = 0;
		for(var i = 0; i < editor.sprites.length; i++){
			var sprite = editor.sprites[i]; 
			var obj = {
				name : sprite.name,
				width : sprite.width,
				height : sprite.height,
				borderLeft : sprite.borderLeft,
				borderTop : sprite.borderTop,
				borderRight : sprite.borderRight,
				borderBottom : sprite.borderBottom,
				subimages : []
			}
			
			  
		
			for(var j = 0; j < sprite.rects.length; j++){
				var img = sprite.rects[j].image; 
				var name = sprite.name + "_"+id;
				obj.subimages.push(name);
				zip.file("images/"+name+".png", img.src.substr(img.src.indexOf(',')+1), {base64: true});
				id++;				
			}
			data.push(obj);
		}
		 
		zip.file("project.agp",  JSON.stringify(data, undefined, 2) ); 
		
		
		var blob = zip.generate({type:"blob"}); 
		saveAs(blob, "Project"+fid+".zip");
		
		editor.projectSaved = true;
	}
	 
	$("showHelp").onclick = function(){
		EnableElements(["help", "blackContainer"]);
	}
	  
	var palette = [[155,209,255],[223,255,255],[255,218,56],[132,157,127],[200,246,254],[238,225,218],[191,233,115],[190,171,94],[211,236,241],[143,215,29],[129,125,93],[184,219,240],[218,182,204],[28,216,94],[185,164,23],[181,211,210],[181,172,190],[26,196,84],[192,202,203],[231,96,228],[43,192,30],[213,178,28],[148,133,98],[185,194,195],[249,52,243],[56,150,97],[255,156,12],[157,157,107],[174,145,214],[73,120,17],[235,150,23],[153,131,44],[152,171,198],[141,137,223],[84,100,63],[227,125,22],[170,120,84],[128,133,184],[110,140,182],[239,90,50],[160,118,58],[170,171,157],[98,95,167],[144,195,232],[219,71,38],[151,107,75],[144,144,144],[124,175,201],[208,80,80],[128,128,128],[104,100,126],[131,162,161],[239,141,126],[140,101,80],[107,132,139],[103,98,122],[125,191,197],[216,152,144],[145,81,85],[106,107,118],[104,86,84],[91,169,169],[196,96,114],[146,81,68],[88,105,118],[92,68,73],[181,62,59],[142,66,66],[66,84,109],[97,200,225],[192,30,30],[62,82,114],[107,92,108],[78,193,227],[134,22,34],[150,67,22],[57,85,101],[109,90,128],[93,127,255],[128,26,52],[76,74,83],[107,68,99],[56,121,255],[141,56,0],[68,68,76],[140,58,166],[11,80,143],[128,44,45],[131,79,13],[62,61,52],[57,48,97],[125,55,65],[73,51,36],[53,44,41],[43,40,84],[0,0,200],[36,36,36]]
	//var palette = [[61,45,80],[61,45,80],[89,80,96],[7,8,36],[34,0,74],[114,101,104],[255,255,255],[54,36,44],[72,55,58],[154,117,147],[250,239,202],[224,153,130],[26,50,75],[31,58,86],[45,68,92],[56,81,108],[99,93,140],[88,29,118],[146,38,144],[174,64,153],[192,83,119],[210,91,105],[254,254,254]]
	sortPalette(palette);
	updatePalette(palette);
		
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
					//render in the canvas
					
					//generatePalette();
				}
				
			};
			reader.readAsDataURL(file);
		}
	}  
	    
	
	this.Apply = function(){ 
		 
		var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		 
	
		 
		var w = imgData.width;
		var h = imgData.height;
		var data = imgData.data; 
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
		
		this.ctx.putImageData(imgData,0,0);
	}
	
	this.ClearProject = function(){
		editor.projectSaved = true;
		//destroy old palette
		 
	}
	   
	    
}


function updatePalette(palette){ 
	 //sortPalette(palette);
	var cont = $("paletteContainer");
	cont.innerHTML = "";
	
	var len = palette.length;
	for(var i=0; i<len; i++)
	{
		var c2 = palette[i];
		var el = document.createElement("span");
		el.style.width = "16px";
		el.style.height = "16px";
		el.style.display = "inline-block";
		el.style.backgroundColor = "rgb("+c2[0]+","+c2[1]+","+c2[2]+")";
		cont.appendChild(el);
		
	}
}

function sortPalette(palette)
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
			var s1 = c1[0]+c1[1]+c1[2];
			var s2 = c2[0]+c2[1]+c2[2];
			//if(c1[0]+c1[1]+c1[2]  > c2[0]+c2[1]+c2[2])
			//if(c1[0]+c1[1]*120+c1[2]*250  > c2[0]+c2[1]*120+c2[2]*250)
			//if(hsv1[0] + hsv1[0]/hsv1[1]*0.2  + hsv1[0]/hsv1[2]*0.5 >  hsv2[0] + hsv2[0]/hsv2[1]*0.2 + hsv2[0]/hsv2[2]*0.5 )
			if(
				s1/20 + s1*hsv1[0]*5 + s1*((hsv1[0]<0.5)?100:0) + s1*hsv1[2]*hsv1[2]*10>
				s2/20 + s2*hsv2[0]*5 + s2*((hsv2[0]<0.5)?100:0) + s2*hsv1[2]*hsv1[2]*10)
			{
				palette[j-1] = c2;
				palette[j] = c1;			
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
		console.log(colorHSV(c1));
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
	
	var palette = [];
	var w = imgData.width;
	var h = imgData.height;
	var data = imgData.data; 
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
	
	editor.ctx.putImageData(imgData,0,0);
	//console.log(JSON.stringify(palette));
	updatePalette(palette);
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
	return Math.abs(hsv1[1] - hsv2[1])
	//return Math.abs((hsv1[0] + hsv1[0]/hsv1[1]*0.2  + hsv1[0]/hsv1[2]*0.5) - (hsv2[0] + hsv2[0]/hsv2[1]*0.2  + hsv2[0]/hsv2[2]*0.5)) 
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


  
  

 


