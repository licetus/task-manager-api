// import errors from '../../errors'
import code from '../../static/httpStatusCode'
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
	return res.sendStatus(code.NoContent)
}

export const updateTask = async (req, res) => {
	const { Task } = global.models
	const data = req.body
	const id = req.swagger.params.id.value
	global.logger.trace('updateTask', data, id)
	await new Task(data).update()
	return res.sendStatus(code.NoContent)
}

export const getTask = async (req, res) => {
	const { Task } = global.models
	const id = req.swagger.params.id.value
	global.logger.trace('getTask', id)
	const item = await new Task().get(id)
	return res.json(item)
}

export const getTaskList = async (req, res) => {
	const { Task } = global.models
	const params = generateListParams(req)
	global.logger.trace('getTaskList', params)
	const items = await new Task().getList(params)
	const total = await new Task().getListCount(params)
	return res.json({
		total,
		items,
	})
}
