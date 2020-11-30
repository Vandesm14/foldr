const fs = require('fs');
const pathlib = require('path');
const settings = {
	ignore: ['.git', 'node_modules']
};

const params = new URLSearchParams(window.location.search);
const path = params.get('path');
let files = getFiles(path);

$(document).ready(function () {
	console.log(files);
});

function getFiles() {
	let pwd = [path || '.'];
	let list = [];

	function dir(path) {
		let names = fs.readdirSync(path);
		names = names.filter(el => !settings.ignore.includes(el));
		names = names.map(function (el) {
			el = {
				name: el,
				path: pathlib.join(...pwd, el),
				level: pwd.length
			};
			let isFile = fs.statSync(path + '/' + el.name).isFile();
			if (isFile) {
				el.type = 'file';
			} else {
				pwd.push(el.name);
				dir(pathlib.join(...pwd));
				el.type = 'directory';
				pwd.pop();
			}
			return el;
		});
		// return names;
		list.push(...names)
	}
	dir(pathlib.join(...pwd));
	return list;
}