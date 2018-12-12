import { $ref, type } from '../constants'

const errorResponse = {
	type: type.object,
	required: ['error'],
	properties: {
		error: {
			$ref: $ref('error'),
		},
	},
}

export default errorResponse
