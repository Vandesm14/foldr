const components = {
	tree: {
		node: (node) => {
			return `<p class="file-node" ${Object.keys(node).map(el => 'js-' + el + '="' + node[el]  + '"').join(' ')}>${node.name}</p>`
		}
	}
}