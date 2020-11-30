const components = {
	tree: {
		node: (node) => {
			return `<p js-path="${node.path}" js-level="${node.level}" js-type="${node.type}">${node.name}</p>`
		}
	}
}