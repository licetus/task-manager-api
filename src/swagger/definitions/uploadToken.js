import { type } from '../constants'

const uploadToken = {
	type: type.object,
	required: [
		'type', 'values',
	],
	properties: {
		type: {
			type: type.string,
			description: 'token 的类型，目前只有 `qiniu`',
		},
		values: {
			description: '描述 token 信息的 Key-Value-Pair，string-to-string',
			type: type.object,
			additionalProperties: {
				type: type.string,
			},
		},
	},
}

export default uploadToken
