import cp from 'child_process'
import run from './run'
import fs from './lib/fs'
import check from './check'

const FORCE = process.argv.includes('force')

async function deploy() {
	const valid = await check('task-manager-model')
	if (!valid) {
		console.log('Deploy terminated.')
		return Promise.reject()
	}
	process.argv.push('release')
	await run(require('./build'))

	const name = 'togroup-app-service'

	const excludes = [
		'',
		'/node_modules/*',
		'log',
		'pid',
		'.git/',
		'.DS_Store',
	]

	if (!FORCE) {
		excludes.push('config.json')
		excludes.push('togroup-app-service.json')
	}

	const cmd = [
		'rsync -avz --delete',
		'--include="/node_modules/task-manager-model"',
		(excludes.join('" --exclude="') + '"').slice(2),
		'-e "ssh -o StrictHostKeyChecking=no"',
		'./build/',
		`astrong:~/${name}`,
	].join(' ')

	return new Promise((resolve, reject) => {
		function start() {
			const server = cp.spawn(
				'/bin/sh',
				['-c', cmd]
			)
			server.stdout.on('data', data => {
				let time = new Date().toTimeString()
				time = time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
				process.stdout.write(`[${time}] `)
				process.stdout.write(data)
				if (data.toString('utf8').includes('total size is')) {
					resolve()
				}
			})
			server.stderr.on('data', data => process.stderr.write(data))
			server.on('error', err => reject(err))
		}

		start()
	})
}

export default deploy
