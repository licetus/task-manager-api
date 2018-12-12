import del from 'del'

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
	await del(['.tmp', 'build/*', '!build/.git'], { dot: true })
}

export default clean
