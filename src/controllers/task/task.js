import errors from '../../errors'
import { generateListParams } from '../../utils'

export const createTask = async (req, res) => {
	const { Task } = global.models
	const data = req.body
	global.logger.trace('createTask', data)
	const object = await new Task(data).save()
	return res.json(object.props.id)
}

export const deleteTask = async (req, res) => {
	const { Task } = global.models
	const id = req.swagger.params.id.value
	global.logger.trace('deleteTask', id)
	await new Task().delete(id)
	return res.sendStatus(204)
}

export const updateTask = async (req, res) => {
	const { Task } = global.models
	const data = req.body
	const id = req.swagger.params.id.value
	global.logger.trace('updateTask', data, id)
	await new Task(data).update()
	return res.sendStatus(204)
}
