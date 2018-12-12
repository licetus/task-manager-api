import errors from '../errors'
import { camelCase2underlineCase } from '../utils'

const type2formats = {
	integer: ['int32', 'int64'],
	number: ['float', 'double'],
	string: ['byte', 'binary', 'date', 'date-time', 'password'],
	boolean: [],
	object: [],
	array: [],
	file: [],
}

function buildName2NameMap(arr) {
	return arr.reduce((map, name) => {
		let keyName = ''
		for (let i = 0; i < name.length; i++) {
			if (name[i] === '-') {
				i++
				keyName += name[i].toUpperCase()
			} else {
				keyName += name[i]
			}
		}
		map[keyName] = name
		return map
	}, {})
}

const typeList = Object.keys(type2formats)

export const type = buildName2NameMap(typeList)

export const format = typeList.reduce((typeConstantsMap, typeName) => {
	typeConstantsMap[typeName] = buildName2NameMap(type2formats[typeName])
	return typeConstantsMap
}, {})

export function $ref(typeName) {
	return `#/definitions/${typeName}`
}

export function code(c, lang = 'javascript') {
	return `${'```'}${lang}
${c}
${'```'}`
}

export const contentType = {
	json: 'application/json',
	jpg: 'image/jpeg',
	formData: 'multipart/form-data',
}

export const xSwagger = {
	controller: 'x-swagger-router-controller',
	operationId: 'operationId',
}

export const pagesize = {
	in: 'query',
	name: 'pagesize',
	description: '分页大小',
	type: type.integer,
	format: format.integer.int32,
	required: false,
	default: 10,
}

export const page = {
	in: 'query',
	name: 'page',
	description: '分页页数(不能同时使用page和next)',
	type: type.integer,
	format: format.integer.int32,
	required: false,
}

export const next = {
	in: 'query',
	name: 'next',
	description: '分页开始id，获取此id之后的数据(不能同时使用page和next)',
	type: type.integer,
	format: format.integer.int64,
	required: false,
}

export const orderBy = {
	in: 'query',
	type: type.string,
	name: 'orderBy',
	description: '按此字段升序排列, 如需降序在后加\' DESC\', 多个字段以\', \'隔开',
}

export const filters = {
	in: 'query',
	type: type.string,
	name: 'filters',
	description: '筛选表达式，每个表达式以逗号隔开，字符串需要添加单引号',
	required: false,
}

export const to = {
	in: 'query',
	name: 'to',
	description: '分页截止到id，表示获取此id之前的数据',
	type: type.integer,
	format: format.integer.int64,
	required: false,
}

export const total = {
	description: '列表总条目',
	type: type.integer,
	format: format.integer.int32,
}

export const eol = {
	description: 'End Of List，表示是否已经到最后一条',
	type: type.boolean,
}

export const generateErrorResponses = (errorArr) => {
	const code2error = errorArr.reduce((map, ErrorConstructor) => {
		const err = new ErrorConstructor()
		if (!map[err.statusCode]) map[err.statusCode] = []
		map[err.statusCode].push({
			errorCode: camelCase2underlineCase(err.name).toUpperCase(),
			message: errors.lang(err) || err.name,
		})
		return map
	}, {})
	return Object.keys(code2error).reduce((map, errorCode) => {
		const errs = code2error[errorCode]
		map[errorCode] = {
			description: `
| code | message |
| ---- | ------- |
${errs.map(err => `| ${err.errorCode} | ${err.message} |\n`).join('')}

`,
			schema: {
				$ref: $ref('errorResponse'),
			},
		}
		return map
	}, {})
}

export default { }
