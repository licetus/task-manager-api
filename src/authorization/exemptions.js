import url from 'url'

const routes = {}

export const add = (path) => {
	/* eslint-disable no-param-reassign */
	path = path.toLowerCase()
	if (!path.startsWith('/')) {
		path = `/${path}`
	}
	routes[path] = true
}

export const has = (path) => {
	if (routes['*']) return true
	const pathname = url.parse(path).pathname.toLowerCase()
	return routes[pathname] || false
}
