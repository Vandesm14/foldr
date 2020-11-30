const argv = require('minimist')(process.argv.slice(2));

let winOptions = {
	icon: 'icon.png',
	frame: true,
	id: 'main'
};

let win = nw.Window.open(`public/index.html?path=${argv[0] || __dirname}`, winOptions, (win) => {
	win.on('loaded', () => {
		win.show();
	});
});
