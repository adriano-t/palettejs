
function DitherGen(canvas){
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	if(!this.ctx){
		alert("Your browser does not support HTML5 Canvas");
	}
}

DitherGen.prototype.dither = function(imgData, amount){
	var w = imgData.width;
	var h = imgData.height;
	var data = imgData.data;
	
	for(var y = 0; y < h; y++){
		yw = y * w;
		ywD = (y+1) * w;
		r = y/h;
		rv = r * 255;
		for(var x = 0; x < w; x++){
			var i = (x + yw) * 4;
			var oPx = this.pixelGet(data, i);
			var nPx = this.colorReduce(oPx, amount);
			var dPx = this.colorDifference(oPx, nPx);
			this.pixelSet(data, i, nPx);
			
			var i1 = (x+1 + yw) * 4;
			this.pixelAdd(data, i1, this.colorMultiply(dPx, 7/16));
			
			var i2 = (x-1 + ywD) * 4;
			this.pixelAdd(data, i2, this.colorMultiply(dPx, 3/16));
			
			var i3 = (x + ywD) * 4;
			this.pixelAdd(data, i3, this.colorMultiply(dPx, 5/16));
			
			var i4 = (x+1 + ywD) * 4;
			this.pixelAdd(data, i4, this.colorMultiply(dPx, 1/16));	
		} 
	}
	this.ctx.putImageData(imgData,0,0);
	
}


DitherGen.prototype.pixelSet = function(data, i, c){
	data[i  ] = c[0];
	data[i+1] = c[1];
	data[i+2] = c[2];
	data[i+3] = c[3];
}

DitherGen.prototype.pixelGet = function(data, i){
	return [
	data[i  ],
	data[i+1],
	data[i+2],
	data[i+3]
	];
}

DitherGen.prototype.pixelReduce = function(data, i, a){
	return [
	Math.floor(data[i]/a)*a,
	Math.floor(data[i+1]/a)*a,
	Math.floor(data[i+1]/a)*a,
	Math.floor(data[i+1]/a)*a
	];
}

DitherGen.prototype.colorReduce = function(c, a){
	return [
	Math.floor(c[0]/a)*a,
	Math.floor(c[1]/a)*a,
	Math.floor(c[2]/a)*a,
	255
	];
}

DitherGen.prototype.colorDifference = function(c1, c2){
	return [
	c1[0] - c2[0],
	c1[1] - c2[1],
	c1[2] - c2[2],
	255
	];
}

DitherGen.prototype.colorMultiply = function(c, val){
	return [
	c[0] * val,
	c[1] * val,
	c[2] * val,
	c[3]
	]
}



DitherGen.prototype.pixelMultiply = function(data, i, g){
	data[i  ] *= g;
	data[i+1] *= g;
	data[i+2] *= g;
	data[i+3] = 255;
}

DitherGen.prototype.pixelAdd = function(data, i, c){
	data[i  ] += c[0];
	data[i+1] += c[1];
	data[i+2] += c[2];
	data[i+3] += c[3];
}

DitherGen.prototype.pixelGradient = function(data, i, c1, c2, g){
	data[i  ] = Math.lerp(c1[0], c2[0], g);
	data[i+1] = Math.lerp(c1[1], c2[1], g);
	data[i+2] = Math.lerp(c1[2], c2[2], g);
	data[i+3] = 255;
}


Math.lerp = function(a, b, t){
	return (1-t)*a + t*b;
}


DitherGen.prototype.testGradient = function(){
	this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
	var grd = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);

	grd.addColorStop(0.14, '#FF0000'); 
	grd.addColorStop(0.285714286, '#FF7F00'); 
	grd.addColorStop(0.428571429, '#FFFF00'); 
	grd.addColorStop(0.571428571, '#00FF00'); 
	grd.addColorStop(0.714285714, '#0000FF'); 
	grd.addColorStop(0.857142857, '#4B0082'); 
	grd.addColorStop(1.0, '#8F00FF');

	this.ctx.fillStyle = grd;
	this.ctx.fill();
	return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
}