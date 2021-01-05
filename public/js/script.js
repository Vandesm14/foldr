const { log } = require('console');
const fs = require('fs');
const pathlib = require('path');
const settings = {
	ignore: ['.git', '.vscode']
};

const params = new URLSearchParams(window.location.search);
const dirname = params.get('path');
let files = [];
let filesList = [];

$(document).ready(function () {
	getFiles();
	updateTree();

	$(document).on('dblclick', '#folders-panel .file-node > .node-name', function (e) {
		if (e.target !== e.currentTarget) return;
		$(this).parent().find('.node-children').toggleClass('state-closed');
	});
	$(document).on('click', '#folders-panel .file-node > .node-name', function (e) {
		if (e.target !== e.currentTarget) return;
		if ($(this).parent().attr('js-type') === 'directory') {
			updateViewer($(this).parent().attr('js-path'));
		} else {
			// TODO: render file type
		}
	});

	$(document).on('click', '#folders-panel .file-node > .node-name > .node-icon', function () {
		$(this).closest('.file-node').find('.node-children').toggleClass('state-closed');
	});

	$(document).on('dblclick', '#files-panel .file-node > .node-name', function (e) {
		if (e.target !== e.currentTarget) return;
		if ($(this).parent().attr('js-type') === 'directory') {
			updateViewer($(this).parent().attr('js-path'));
		} else {
			// TODO: render file type
		}
	});
});

function getFiles() {
	let pwd = [dirname || '.'];
	let list = [];
	filesList = [];

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
				el.children = dir(pathlib.join(...pwd));
				el.type = 'directory';
				pwd.pop();
			}
			filesList.push(el);
			return el;
		});
		return names;
	}
	list = dir(pathlib.join(...pwd));
	list.sort(function (a, b) {
		if (a.path > b.path) {
			return 0;
		} else {
			return -1;
		}
	});
	filesList.sort(function (a, b) {
		if (a.path > b.path) {
			return 0;
		} else {
			return -1;
		}
	});
	
	files = list;
}

function updateTree() {
	$('#folders-panel').empty();
	$('#folders-panel').html(filesList.filter(el => el.type === 'directory').map(components.tree.node).join('\n'));
	$('#folders-panel > .file-node').each(function () {
		$(this).css('padding-left', 3 + 6 * (+$(this).attr('js-level') - 1));
		$(this).addClass('type-' + $(this).attr('js-type'));

		if (+$(this).attr('js-level') > 1) {
			$(this).appendTo($(`#folders-panel .file-node[js-path="${$(this).attr('js-parent')}"] > .node-children`));
		}
	});
}

function updateViewer(path) {
	let that = this;
	$('#files-panel').empty();
	$('#folders-panel .file-node .node-name.active').removeClass('active');
	$(`#folders-panel .file-node[js-path="${path}"] .node-name`).first().addClass('active');

	$('#files-panel').html(filesList.filter(el => el.parent === pathlib.join(...path.split('/'))).map(components.tree.node).join('\n'));
	$('#files-panel > .file-node').each(function () {
		$(this).css('padding-left', 3 + 6 * (+$(this).attr('js-level') - +$(that).attr('js-level') - 1));
		$(this).addClass('type-' + $(this).attr('js-type'));

		if (+$(this).attr('js-level') > 1) {
			$(this).appendTo($(`#files-panel .file-node[js-path="${$(this).attr('js-parent')}"] > .node-children`));
		}
	});
	$('#files-panel .type-directory').detach().prependTo('#files-panel');
}