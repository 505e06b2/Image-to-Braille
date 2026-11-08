const settings = {
	last_canvas: null,
	last_dithering: null,
	last_source: "",

	width: 62,
	greyscale_mode: "luminance",
	inverted: false,
	dithering: false,
	monospace: false,
	language: navigator.language.startsWith('zh') ? "zh" : "en" // 根据浏览器语言设置默认语言
}

function setUIElement(selector, value) {
	const elem = document.querySelector(selector);
	switch(elem.getAttribute("type")) { //should all be <input>
		case "checkbox":
			elem.checked = value;
			break;

		default:
			elem.value = value;
	}
	return elem;
}

// 更新页面上的所有文本元素
function updateLanguage(lang) {
	settings.language = lang;
	
	// 更新页面标题和描述
	document.title = translations[lang].title;
	document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].description);
	
	// 更新所有带有data-i18n属性的元素
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		if (translations[lang][key]) {
			if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
				element.value = translations[lang][key];
			} else {
				element.textContent = translations[lang][key];
			}
		}
	});
	
	// 更新仓库链接
	const repoLink = document.getElementById('repoLink');
	if (repoLink) {
		repoLink.href = lang === 'zh' ? 
			'https://cnb.cool/SDCOM/Image-to-Braille' : 
			'https://github.com/SDCOM-0415/Image-to-Braille';
	}
	
	// 更新title属性
	document.querySelector('div[title]').setAttribute('title', lang === 'zh' ? '切换深色主题' : 'Toggle dark theme');
	document.querySelectorAll('div[title]')[1].setAttribute('title', lang === 'zh' ? '黑白颜色反转' : 'Invert black with white');
	document.querySelectorAll('div[title]')[2].setAttribute('title', lang === 'zh' ? '单色抖动效果' : 'Monochrome dithering');
	document.querySelectorAll('div[title]')[3].setAttribute('title', lang === 'zh' ? '禁用占位符间距' : 'Disable placeholder spacing');
	document.querySelectorAll('div[title]')[4].setAttribute('title', lang === 'zh' ? '灰度模式' : 'Greyscale Mode');
}

function initUI() {
	document.body.ondragover = (e) => e.preventDefault();
	document.body.ondrop = (e) => {
		e.preventDefault();
		loadNewImage(URL.createObjectURL(e.dataTransfer.items[0].getAsFile()));
	}
	document.body.onpaste = (e) => {
		event.preventDefault();
		loadNewImage(URL.createObjectURL(e.clipboardData.items[0].getAsFile()));
	}

	//buttons
	const r = () => parseCanvas(settings.last_canvas); //shorten for compactness

	document.querySelector('input[type="file"]').onchange = (e) => {
		 loadNewImage(URL.createObjectURL(e.target.files[0]));
	}

	setUIElement('#darktheme', settings.inverted).onchange = (e) => {
		const element = document.querySelector('#text');
		if(e.target.checked) element.classList.add("dark");
		else element.classList.remove("dark");
	};

	setUIElement('#inverted', settings.inverted).onchange = (e) => {settings.inverted = e.target.checked; r()};
	setUIElement('#dithering', settings.dithering).onchange = (e) => {settings.dithering = e.target.checked; r()};
	setUIElement('#monospace', settings.monospace).onchange = (e) => {settings.monospace = e.target.checked; r()};

	document.querySelector('#greyscale_mode').onchange = (e) => {
		settings.greyscale_mode = e.target.value;
		parseCanvas(settings.last_canvas);
	};

	setUIElement('#width', settings.width).onchange = (e) => {
		settings.width = e.target.value;
		loadNewImage(settings.last_source);
	};

	document.querySelector('#clipboard').onclick = (e) => {
		 document.querySelector('#text').select();
		 document.execCommand("copy");
	}
	
	// 添加语言切换功能
	document.querySelector('#langSelect').onchange = (e) => {
		const newLang = e.target.value;
		updateLanguage(newLang);
	}
	
	// 设置选择框的初始值为当前语言
	document.querySelector('#langSelect').value = settings.language;
	
	// 初始化语言
	updateLanguage(settings.language);
}

async function loadNewImage(src) {
	if(src === undefined) return;

	if(settings.last_source && settings.last_source !== src) URL.revokeObjectURL(settings.last_source);

	settings.last_source = src;
	const canvas = await createImageCanvas(src);
	settings.last_canvas = canvas;
	settings.last_dithering = null;
	await parseCanvas(canvas);
}

async function parseCanvas(canvas) {
	const text = canvasToText(canvas);
	document.querySelector('#text').value = text;
	document.querySelector('#charcount').innerText = text.length;
}

window.onload = () => {
	initUI();
	loadNewImage("select.png");
}