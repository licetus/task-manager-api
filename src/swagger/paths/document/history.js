import { assemblePath } from '../../utils'
import { $ref, contentType, format, type, page, next, pagesize, filters, orderBy } from '../../constants'

const routes = {}

const createContent = {
	in: 'body',
	name: 'body',
	description: 'create tag content',
	required: true,
	schema: {
		$ref: $ref('createTagRequest'),
	},
}

const generalDescription = {
	tags: ['Tag'],
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
		operationId: 'getDocumentHistoryList',
		summary: 'Get Document History List',
		...generalDescription,
		parameters: [page, pagesize, next, filters, orderBy],
	},
}


const basePath = 'history'

export default assemblePath(routes, basePath)
