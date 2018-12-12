import { exist, readFile } from './lib/fs'

/**
 * 检查 task-manager-model 的版本
 */
async function check(name) {
	const file = `node_modules/${name}/package.json`
	if (!await exist(file)) {
		console.log(`\n\n\x1B[31m> ⚠️	${name} is not existed!!! \x1B[39m`)
		return false
	}
	let current = JSON.parse(await readFile(file)).gitHead
	if (!current) {
		// 没有读取到 package.json 里的 gitHead，可能是 yarn 模式
		// 改为尝试读取 yarn.lock
		const locks = await readFile('./yarn.lock')
		if (locks) {
			const re = new RegExp(`${name}\\.git#\\w+`, 'g') // /togroup\-models\.git\#\w+/g
			const matches = locks.match(re)
			if (matches) current = matches[0].split('#')[1]
		}
	}
	const claim = JSON.parse(await readFile('./package.json')).dependencies[name]
	if (claim) {
		const [, head] = claim.split('#')
		if (current.indexOf(head) !== 0) {
			console.log(`\n\n\x1B[31m> ⚠️	Please run npm install to update ${name}\x1B[39m`)
			console.log(`\x1B[31m> ⚠️	${current.slice(0, 7)} ------> ${head}\x1B[39m\n\n`)
			return false
		}
		console.log(`\n✅	${name} #${head}\n`)
	}
	return true
}

export default check
