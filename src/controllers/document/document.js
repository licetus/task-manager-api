import errors from '../../errors'
import { generateListParams } from '../../utils'

export const createDocument = async (req, res) => {
	const { Document, DocumentTag } = global.models
	const data = req.body
	global.logger.trace('createDocument', req.body)
	const tags = { data }
	if (data.tags) {
		delete data.tags
	}
	const object = await new Document(data).save()

	if (Array.isArray(tags) && tags.length > 0) {
		const inserts = []
		tags.forEach((tag) => {
			const tagData = { documentId: object.props.id, tagId: tag }
			const docTag = new DocumentTag(tagData)
			inserts.push(docTag.save())
		})
		await Promise.all(inserts)
	}
	return res.json(object.props.id)
}

export const getDocumentList = async (req, res) => {
	const { Document } = global.models
	const params = generateListParams(req)
	global.logger.trace('getDocumentList', params)
	const items = await new Document().getViewList('view_document', 'id', params)
	const total = await new Document().getViewListCount('view_document', 'id', params)
	return res.json({
		total,
		items,
	})
}

export const getDocumentHistoryList = async (req, res) => {
	const { Document } = global.models
	let params = generateListParams(req)
	global.logger.trace('getDocumentHistoryList', params)
	if (params === undefined || params === null) {
		params = {}
	}
	if (params.pagesize === undefined || params.pagesize === null) {
		params.pagesize = 10
	}
	params.page = 0
	params.orderBy = 'viewTime desc'
	const items = await new Document().getViewList('view_document_history', 'id', params)
	return res.json(items)
}

export const getDocument = async (req, res) => {
	const { Document, DocumentHistory } = global.models
	const id = req.swagger.params.id.value
	global.logger.trace('getDocument', id)
	const filters = [`id=${id}`]
	const item = await new Document().getViewList('view_document', 'id', { filters })
	if (item.length > 0) {
		await new DocumentHistory({ documentId: item[0].id }).save()
		return res.json(item[0])
	}
	throw new errors.InvalidIdError()
}

export const updateDocument = async (req, res) => {
	const { Document, DocumentTag } = global.models
	const data = req.body
	const id = req.swagger.params.id.value
	global.logger.trace('updateDocument', req.body, id)

	data.id = id
	const { tags } = data
	if (data.tags) {
		delete data.tags
	}
	if (Array.isArray(tags)) {
		const originTags = await new DocumentTag().getList({ filters: [`documentId=${id}`] })
		const deletes = []
		originTags.forEach((tag) => {
			const docTag = new DocumentTag()
			deletes.push(docTag.delete(tag.id))
		})
		await Promise.all(deletes)
		const inserts = []
		tags.forEach((tag) => {
			const tagData = { documentId: id, tagId: tag }
			const docTag = new DocumentTag(tagData)
			inserts.push(docTag.save())
		})
		await Promise.all(inserts)
	}

	await new Document(data).update()

	return res.sendStatus(204)
}

export const deleteDocument = async (req, res) => {
	const { Document } = global.models
	const id = req.swagger.params.id.value
	global.logger.trace('deleteDocument', id)
	await new Document().delete(id)
	return res.sendStatus(204)
}
