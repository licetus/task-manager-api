import run from './run'
import build from './build'
import serve from './serve'

async function start() {
	await run(build, { watching: true })
	await run(serve)
}

export default start
