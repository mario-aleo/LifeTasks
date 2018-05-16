/*eslint-disable no-unused-vars*/

function importStyle (href, option) {
	if (document.querySelector(`link[href="${ href }"]`))
		return;
	if (option) {
		if (option.preload) {
			const preload = document.createElement('link');
			preload.as = 'style';
			preload.rel = 'preload';
			preload.href = href;
			document.head.appendChild(preload);
		}
	}
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	document.head.appendChild(link);
}