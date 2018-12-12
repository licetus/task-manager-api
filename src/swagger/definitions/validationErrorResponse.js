import { $ref, type } from '../constants'

const validationErrorResponse = {
	type: type.object,
	required: ['error'],
	properties: {
		error: {
			$ref: $ref('validationError'),
		},
	},
}

export default validationErrorResponse
