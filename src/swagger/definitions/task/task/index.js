import { type as T } from '../../../constants'
import { isCompleted, title, content, deadline } from './properties'

export const createTaskRequest = {
	description: 'create task request',
	type: T.object,
	properties: {
		isCompleted,
		title,
		content,
		deadline,
	},
}

export const updateTaskRequest = {
	description: 'update task request',
	type: T.object,
	properties: {
		isCompleted,
		title,
		content,
		deadline,
	},
}
