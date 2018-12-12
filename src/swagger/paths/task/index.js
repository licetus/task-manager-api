import { assemblePath } from '../../utils'
import { $ref, contentType, format, type, page, next, pagesize, filters, orderBy } from '../../constants'

const routes = {
}

const id = {
	in: 'path',
	name: 'id',
	required: true,
	type: type.integer,
	format: format.integer.int64,
	description: 'task id',
}

const updateContent = {
	in: 'body',
	name: 'body',
	description: 'update task content',
	required: true,
	schema: {
		$ref: $ref('updateTaskRequest'),
	},
}

const createContent = {
	in: 'body',
	name: 'body',
	description: 'create task content',
	required: true,
	schema: {
		$ref: $ref('createTaskRequest'),
	},
}

const generalDescription = {
	tags: ['Task'],
	consumes: [contentType.json],
	produces: [contentType.json],
	responses: {
		200: {
			description: 'return 200 if succeed',
		},
	},
}

routes[''] = {
	get: {
		operationId: 'getTaskList',
		summary: 'Get task list',
		...generalDescription,
		parameters: [page, pagesize, next, filters, orderBy],
	},
	post: {
		operationId: 'createTask',
		summary: 'Create task',
		...generalDescription,
		parameters: [createContent],
	},
}

routes['{id}'] = {
	get: {
		operationId: 'getTask',
		summary: 'Get task by id',
		...generalDescription,
		parameters: [id],
	},
	patch: {
		operationId: 'updateTask',
		summary: 'Update task',
		...generalDescription,
		parameters: [id, updateContent],
	},
	delete: {
		operationId: 'deleteTask',
		summary: 'Delete task',
		...generalDescription,
		parameters: [id],
	},
}

const basePath = 'task'

export default assemblePath(routes, basePath)
