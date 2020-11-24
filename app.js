let winOptions = {
	icon: 'icon.png',
	frame: true,
	id: 'main'
};

let win = nw.Window.open('public/index.html', winOptions, (win) => {
	console.log('Opened window');
});

win.show();