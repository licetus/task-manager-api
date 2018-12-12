export const assemblePath = (routes, basePath) => Object.keys(routes).reduce((paths, route) => {
	paths[`${basePath}${route === '' ? '' : `/${route}`}`] = routes[route]
	return paths
}, {})
