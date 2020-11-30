const fs = require('fs');
const pathlib = require('path');
const settings = {
	ignore: ['.git', 'node_modules', '.vscode']
};

const params = new URLSearchParams(window.location.search);
const path = params.get('path');
let files = [];

$(document).ready(function () {
	getFiles();
	updateTree();

	$(document).on('click', '#file-tree > p', function () {
		if ($(this).attr('js-type') === 'directory') {
			updateViewer.call(this);
		} else {
			// render file type
		}
	});
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
				parent: pathlib.join(...pwd),
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
		list.push(...names);
	}
	dir(pathlib.join(...pwd));
	list.sort(function (a, b) {
		if (a.path > b.path) {
			return 0;
		} else {
			return -1;
		}
	});
	files = list;
}

function updateTree() {
	$('#file-tree').html(files.filter(el => el.type === 'directory').map(components.tree.node).join('\n'));
	$('#file-tree > p').each(function () {
		$(this).css('padding-left', 3 + 6 * (+$(this).attr('js-level') - 1));
		$(this).addClass('type-' + $(this).attr('js-type'));
	});
}

function updateViewer() {
	let that = this;
	$('#viewer').html(files.filter(el => el.parent.indexOf($(this).attr('js-path')) !== -1).map(components.tree.node).join('\n'));
	$('#viewer > p').each(function () {
		$(this).css('padding-left', 3 + 6 * (+$(this).attr('js-level') - +$(that).attr('js-level') - 1));
		$(this).addClass('type-' + $(this).attr('js-type'));
	});
}