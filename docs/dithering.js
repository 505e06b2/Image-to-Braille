// Credit to https://gist.github.com/PhearTheCeal/6443667 for the algorithm

function Dithering(canvas) {
	this.canvas = canvas;
	this.image_data = new Uint8Array(canvas.getContext("2d").getImageData(0,0, canvas.width, canvas.height).data); //clone

	let oldpixel;
	let newpixel;
	let quant_error;
	let err_red, err_green, err_blue;

	const _getPixel = (x, y) => {
		const index = (x + y * canvas.width) * 4;
		return [ this.image_data[index+0], this.image_data[index+1], this.image_data[index+2] ];
	}

	const _setPixel = (x, y, colour) => {
		const index = (x + y * canvas.width) * 4;
		this.image_data[index+0] = Math.floor(colour[0]+0.5);
		this.image_data[index+1] = Math.floor(colour[1]+0.5);
		this.image_data[index+2] = Math.floor(colour[2]+0.5);
		this.image_data[index+3] = 255;
	}

	const _closestPalleteColour = (pixel) => {
		return (0.2126*pixel[0] + 0.7152*pixel[1] + 0.0722*pixel[2]) > 128 ? [255,255,255] : [0,0,0];
	}

	const _colourDifference = (one, two) => {
		return [(one[0] - two[0]), (one[1] - two[1]), (one[2] - two[2])];
	}

	const _colourAddError = (x, y, err_red, err_green, err_blue) => {
		const clip = (x) => (x < 0 ? 0 : (x > 255 ? 255 : x));
		const index = (x + y * canvas.width) * 4;
		this.image_data[index+0] = clip(this.image_data[index+0] + err_red)
		this.image_data[index+1] = clip(this.image_data[index+1] + err_green)
		this.image_data[index+2] = clip(this.image_data[index+2] + err_blue)
		this.image_data[index+3] = 255;
	}

	for(let y = 0; y < canvas.height; y++) {
		for(let x = 0; x < canvas.width; x++) {
			oldpixel = _getPixel(x, y);
			newpixel = _closestPalleteColour(oldpixel);
			_setPixel(x, y, newpixel);
			quant_error = _colourDifference(oldpixel, newpixel);

			err_red = quant_error[0];
			err_green = quant_error[1];
			err_blue = quant_error[2];

			if(x+1 < canvas.width)             _colourAddError(x+1, y,   (7/16) * err_red, (7/16) * err_green, (7/16) * err_blue);
			if(x-1 > 0 && y+1 < canvas.height) _colourAddError(x-1, y+1, (3/16) * err_red, (3/16) * err_green, (3/16) * err_blue);
			if(y+1 < canvas.height)            _colourAddError(x,   y+1, (5/16) * err_red, (5/16) * err_green, (5/16) * err_blue);
			if(x+1 < canvas.width)             _colourAddError(x+1, y+1, (1/16) * err_red, (1/16) * err_green, (1/16) * err_blue);
		}
	}
}
