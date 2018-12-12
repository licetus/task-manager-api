import { type as T } from '../../../constants'
import { documentId, tagId } from './properties'

export const createDocumentTagRequest = {
	description: 'create documentTag request',
	type: T.object,
	properties: {
		documentId,
		tagId,
	},
}

export const updateDocumentTagRequest = {
	description: 'update documentTag request',
	type: T.object,
	properties: {
		documentId,
		tagId,
	},
}
