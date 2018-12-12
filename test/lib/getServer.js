import { configure } from 'task-manager-model'
import server from '../../src/server'
import options from '../../src/config'

global.__DEV__ = true
global.__TEST__ = true

let app = null

export default async () => {
	if (app === null) {
		const dbManager = await configure(options)
		await dbManager.rebuild()
		app = await server()
	}
	return app
}
