// Credit to https://gist.github.com/liamappelbe/c2c76ad1ba655aa1caae5da40bcadc7e for the algorithm

function Dithering(canvas) {
	this.canvas = canvas;
	const ctx = canvas.getContext("2d");
	const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	this.image_data = new Uint8Array(imgData.data);

	const width = canvas.width;
	const height = canvas.height;
	const totalPixels = width * height;

	// 1. Конвертуємо RGBA у градації сірого (Luminance)
	const gray = new Float32Array(totalPixels);
	for (let i = 0; i < totalPixels; i++) {
		const idx = i * 4;
		gray[i] = 0.2126 * this.image_data[idx] + 0.7152 * this.image_data[idx + 1] + 0.0722 * this.image_data[idx + 2];
	}

	// 2. Бітовий масив для відстеження оброблених пікселів (isDone / setDone)
	const doneFlags = new Uint8Array(Math.ceil(totalPixels / 8));
	const isDone = (k) => Boolean(doneFlags[k >> 3] & (1 << (k % 8)));
	const setDone = (k) => { doneFlags[k >> 3] |= (1 << (k % 8)); };

	// 3. Генеруємо випадковий порядок обходу пікселів (Fisher-Yates shuffle)
	const order = new Int32Array(totalPixels);
	for (let i = 0; i < totalPixels; i++) order[i] = i;
	for (let i = totalPixels - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = order[i];
		order[i] = order[j];
		order[j] = temp;
	}

	const clamp = (v) => (v <= 0 ? 0 : v >= 255 ? 255 : v);

	// 4. Основний цикл Dizzy Dithering
	for (let idx = 0; idx < totalPixels; idx++) {
		const k = order[idx];
		const x = k % width;
		const y = Math.floor(k / width);

		const oldVal = gray[k];
		const newVal = oldVal < 128 ? 0 : 255;
		gray[k] = newVal;

		const err = oldVal - newVal;

		// Перевірка 4 сусідів (RULD: справа, знизу, зліва, зверху)
		const neighbors = [];
		if (x + 1 < width && !isDone(k + 1))         neighbors.push(k + 1);
		if (y + 1 < height && !isDone(k + width))     neighbors.push(k + width);
		if (x - 1 >= 0 && !isDone(k - 1))             neighbors.push(k - 1);
		if (y - 1 >= 0 && !isDone(k - width))         neighbors.push(k - width);

		const n = neighbors.length;
		if (n > 0) {
			const derr = err / n;
			for (let i = 0; i < n; i++) {
				const nk = neighbors[i];
				gray[nk] = clamp(Math.round(gray[nk] + derr));
			}
		}

		setDone(k);
	}

	// 5. Записуємо 1-бітний результат назад у RGBA-буфер
	for (let i = 0; i < totalPixels; i++) {
		const idx = i * 4;
		const val = gray[i];
		this.image_data[idx] = val;
		this.image_data[idx + 1] = val;
		this.image_data[idx + 2] = val;
		this.image_data[idx + 3] = 255;
	}
}
