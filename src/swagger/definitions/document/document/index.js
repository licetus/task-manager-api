import { type as T } from '../../../constants'
import { type, url, thumbUrl, name, category, content, size } from './properties'

export const createDocumentRequest = {
	description: 'create document request',
	type: T.object,
	properties: {
		type,
		url,
		thumbUrl,
		name,
		category,
		content,
		size,
	},
}

export const updateDocumentRequest = {
	description: 'update document request',
	type: T.object,
	properties: {
		type,
		url,
		thumbUrl,
		name,
		category,
		content,
		size,
	},
}
