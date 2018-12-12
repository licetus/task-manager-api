import errors from '../../errors'
import { checkOperator, requireCurrentAccount } from '../../utils/auth'
import { generateListParams } from '../../utils'
//
// export const getTag = async (req, res) => {
// 	const { Tag } = global.models
// 	const id = req.swagger.params.id.value
// 	global.logger.trace('getTag', id)
// 	checkOperator(req)
// 	const item = await new Tag().get(id)
// 	return res.json(item)
// }
//
// export const updateTag = async (req, res) => {
// 	const { Tag } = global.models
// 	const data = req.body
// 	const id = req.swagger.params.id.value
// 	const { id: userId, role } = requireCurrentAccount(req)
// 	global.logger.trace('updateTag', userId, role, req.body, id)
// 	checkOperator(req)
// 	data.id = id
// 	const isExist = await new Tag().isExist(id)
// 	if (!isExist) throw new errors.InvalidIdError()
// 	await new Tag(data).update()
// 	return res.sendStatus(204)
// }
//
// export const deleteTag = async (req, res) => {
// 	const { Tag } = global.models
// 	const id = req.swagger.params.id.value
// 	const { id: userId, role } = requireCurrentAccount(req)
// 	global.logger.trace('deleteTag', userId, role, id)
// 	checkOperator(req)
// 	await new Tag().delete(id)
// 	return res.sendStatus(204)
// }

export const getTagList = async (req, res) => {
	const { Tag } = global.models
	const params = generateListParams(req)
	global.logger.trace('getTagList', params)
	const items = await new Tag().getList(params)
	const total = await new Tag().getListCount(params)
	return res.json({
		total,
		items,
	})
}

export const createTag = async (req, res) => {
	const { Tag } = global.models
	const data = req.body
	// const { id: userId, role } = requireCurrentAccount(req)
	global.logger.trace('createTag', req.body)
	if (data.id) delete data.id
	await new Tag(data).save()
	return res.sendStatus(204)
}
