const components = {
	tree: {
		node: (node) => {
			return `<p ${Object.keys(node).map(el => 'js-' + el + '="' + node[el]  + '"').join(' ')}>${node.name}</p>`
		}
	}
}