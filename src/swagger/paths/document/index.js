import { assemblePath } from '../../utils'
import { $ref, contentType, format, type, page, next, pagesize, filters, orderBy } from '../../constants'
import tag from './tag'
import history from './history'

const routes = {
	...tag,
	...history,
}

const id = {
	in: 'path',
	name: 'id',
	required: true,
	type: type.integer,
	format: format.integer.int64,
	description: 'document `id`',
}

const updateContent = {
	in: 'body',
	name: 'body',
	description: 'update document content',
	required: true,
	schema: {
		$ref: $ref('updateDocumentRequest'),
	},
}

const createContent = {
	in: 'body',
	name: 'body',
	description: 'create document content',
	required: true,
	schema: {
		$ref: $ref('createDocumentRequest'),
	},
}

const generalDescription = {
	tags: ['Document'],
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
		operationId: 'getDocumentList',
		summary: 'Get document list',
		...generalDescription,
		parameters: [page, pagesize, next, filters, orderBy],
	},
	post: {
		operationId: 'createDocument',
		summary: 'Create document',
		...generalDescription,
		parameters: [createContent],
	},
}

routes['{id}'] = {
	get: {
		operationId: 'getDocument',
		summary: 'Find document by id',
		...generalDescription,
		parameters: [id],
	},
	patch: {
		operationId: 'updateDocument',
		summary: 'Update document',
		...generalDescription,
		parameters: [id, updateContent],
	},
	delete: {
		operationId: 'deleteDocument',
		summary: 'Delete document',
		...generalDescription,
		parameters: [id],
	},
}

const basePath = 'document'

export default assemblePath(routes, basePath)
