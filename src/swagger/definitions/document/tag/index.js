import { type as T } from '../../../constants'
import { name, description } from './properties'

export const createTagRequest = {
	description: 'create tag request',
	type: T.object,
	properties: {
		name,
		description,
	},
}

export const updateTagRequest = {
	description: 'update tag request',
	type: T.object,
	properties: {
		name,
		description,
	},
}
