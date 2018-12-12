import { type } from '../constants'
import errors from '../../errors'
import { camelCase2underlineCase } from '../../utils'

const errorCodeTableBody = Object.keys(errors)
	.filter((key) => typeof errors[key] === 'function')
	.map((code) =>
		`| ${
		camelCase2underlineCase(code).toUpperCase()
	} | ${
		errors.localization[code.replace(/Error$/, '')] || '-'
	} |\n`)
	.join('')

export const errorDescription = `
错误号和描述对应表如下：

| code | message |
| ---- | ------- |
${errorCodeTableBody}

`

const error = {
	type: type.object,
	required: ['code'],
	description: '见文档开头错误号说明。',
	properties: {
		code: {
			type: type.string,
		},
		message: {
			type: type.string,
		},
	},
}

export default error
