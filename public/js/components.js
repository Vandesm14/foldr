const components = {
	tree: {
		node: (node) => {
			return `<div class="file-node" ${Object.keys(node).map(el => {
				if (el === 'path' || el === 'parent') {
					return 'js-' + el + '="' + node[el].replace(/\\/g, '/')  + '"'; // TODO: Make sure that "\" isn't a linux escape
				} else if (el === 'children') {
					return '';
				} else {
					return 'js-' + el + '="' + node[el]  + '"';
				}
			}).join(' ')}><p class="node-name"><span class="node-icon">${node.type === 'directory' ? '📁' : '📄'}</span>${node.name}</p><p class="node-children"></p></div>`
		}
	}
};