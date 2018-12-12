import path from 'path'
import cp from 'child_process'
import watch from './lib/watch'

let server

function onStdOut(data) {
	const time = new Date().toTimeString()

	process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '))
	process.stdout.write(data)
}

function kill() {
	if (server) server.kill('SIGTERM')
}

function serve() {
	return new Promise((resolve, reject) => {
		function start() {
			kill()
			server = cp.spawn(
				'node',
				[path.join(__dirname, '../build/server.js')],
				{
					env: Object.assign({ NODE_ENV: 'development' }, process.env),
					silent: false,
				},
			)

			server.stdout.on('data', onStdOut)
			server.stderr.on('data', data => process.stderr.write(data))
			server.on('error', err => reject(err))

			return server
		}

		server = start()

		watch([
			'build/server.js',
			'build/config.json',
			'build/node_modules/task-manager-model/dist/models.js',
		]).then(watcher => {
			watcher.on('changed', () => {
				server = start()
			})
		})
	})
}

process.on('exit', kill)

export default serve
