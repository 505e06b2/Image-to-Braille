var file = null;
var text = {};
var weight = 3;
var max_width = 100;
var inverted = false;

window.onload = function() {
	darkTheme(inverted);
	text = document.getElementById("text");
	file = "select.png";
	filechanged();
}

function get_char(current) {
	allzeros = true;
	for(var i = 0; i < current.length; i++) if(current[i] != 0) {allzeros = false; break;}
    if(!allzeros) {
        total_val = (current[0] << 0) + (current[1] << 1) + (current[2] << 2) + (current[4] << 3) + (current[5] << 4) + (current[6] << 5) + (current[3] << 6) + (current[7] << 7);
    } else {
        total_val = 4;
	}
    return String.fromCharCode(0x2800 + total_val);
}

function nearest_multiple(num, mult) {
    return num - (num % mult);
}

//events

function tobraille(img) {
	{ //place image on canvas and keep aspect ratio
		var width = img.width;
		var height = img.height;
		if(img.width > max_width) {
			width = max_width;
			height = width * img.height / img.width;
		}

		canvas.width = nearest_multiple(width, 2);
		canvas.height = nearest_multiple(height, 4);
	}
	
	var ctx = canvas.getContext("2d");
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0,0, canvas.width,canvas.height);
	
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	var output_line = "";

	for(var imgy = 0; imgy < canvas.height; imgy += 4) {
		for(var imgx = 0; imgx < canvas.width; imgx += 2) {
			var current = [0,0,0,0,0,0,0,0];
			var cindex = 0;
			for(var x = 0; x < 2; x++) {
				for(var y = 0; y < 4; y++) {
					var temp = ctx.getImageData(imgx+x, imgy+y, 1,1).data;
					var avg = (temp[0] + temp[1] + temp[2]) / weight;
					if(inverted) {
						if(avg > 128) current[cindex] = 1;
					} else {
						if(avg < 128) current[cindex] = 1;
					}
					cindex++;
				}
			}
			output_line += get_char(current);
		}
		output_line += "\n";
	}
	text.innerHTML = output_line;
}

function filechanged(input) {
	img = new Image();
	canvas = document.createElement("CANVAS");
	img.onload = function() {tobraille(img)};
	if(input) file = URL.createObjectURL(input);
	img.src = file;
}