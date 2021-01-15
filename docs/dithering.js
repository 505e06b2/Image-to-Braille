// Credit to https://gist.github.com/PhearTheCeal/6443667 for the algorithm

var image_data;

function clip(x) {
	return x < 0 ? 0 : (x > 255 ? 255 : x)
}

function setPixel(x, y, color) {
	var index = (x + y * image_data.width) * 4;
	image_data.data[index+0] = parseInt(color[0]+0.5);
	image_data.data[index+1] = parseInt(color[1]+0.5);
	image_data.data[index+2] = parseInt(color[2]+0.5);
	image_data.data[index+3] = 255;
}

function color_diff(one, two) {
	return [(one[0] - two[0]), (one[1] - two[1]), (one[2] - two[2])];
}

function color_add_err(x, y, err_red, err_green, err_blue) {
	var index = (x + y * image_data.width) * 4;
	image_data.data[index+0] = clip(image_data.data[index+0]+err_red)
	image_data.data[index+1] = clip(image_data.data[index+1]+err_green)
	image_data.data[index+2] = clip(image_data.data[index+2]+err_blue)
	image_data.data[index+3] = 255;
}

function find_closest_palette_color(pixel) {
	return (0.2126*pixel[0] + 0.7152*pixel[1] + 0.0722*pixel[2]) > 128 ? [255,255,255] : [0,0,0];
}

function get_pixel(x, y) {
	var index = (x + y * image_data.width) * 4;
	return [ image_data.data[index+0], image_data.data[index+1], image_data.data[index+2] ];
}

function rgb2bin() {
	image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

	var oldpixel;
	var newpixel;
	var quant_error;
	var err_red, err_green, err_blue;

	for (var y = 0; y < canvas.height; y++) {
		for (var x = 0; x < canvas.width; x++) {
			oldpixel = get_pixel(x, y);
			newpixel = find_closest_palette_color(oldpixel);
			setPixel(x, y, newpixel);
			quant_error = color_diff(oldpixel, newpixel);

			err_red = quant_error[0];
			err_green = quant_error[1];
			err_blue = quant_error[2];

			if (x+1 < canvas.width)
				color_add_err(x+1, y,   (7/16) * err_red, (7/16) * err_green, (7/16) * err_blue);
			if (x-1 > 0 && y+1 < canvas.height)
				color_add_err(x-1, y+1, (3/16) * err_red, (3/16) * err_green, (3/16) * err_blue);
			if (y+1 < canvas.height)
				color_add_err(x,   y+1, (5/16) * err_red, (5/16) * err_green, (5/16) * err_blue);
			if (x+1 < canvas.width)
				color_add_err(x+1, y+1, (1/16) * err_red, (1/16) * err_green, (1/16) * err_blue);
		}
	}

	ctx.putImageData(image_data, 0, 0);
}
