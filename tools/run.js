function format(time) {
	return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
}

function run(fn, options) {
	const task = typeof fn.default === 'undefined' ? fn : fn.default
	const start = new Date()
	console.log(
		`[${format(start)}] Starting '${task.name}${options ? `(${JSON.stringify(options)})` : ''}'...`
	)
	return task(options).then(() => {
		const end = new Date()
		const time = end.getTime() - start.getTime()
		const params = options ? `(${JSON.stringify(options)})` : ''
		console.log(
			`[${format(end)}] Finished '${task.name}${params}' after ${time} ms`
		)
	})
}

if (process.mainModule.children.length === 0 && process.argv.length > 2) {
	delete require.cache[__filename] // eslint-disable-line no-underscore-dangle
	const module = require(`./${process.argv[2]}.js`).default
	run(module).catch(err => console.error(err.stack))
}

export default run
