import { $ref, type
} from '../constants'

const validationError = {
	description: 'error object describing the validation error, extend error',
	allOf: [{
		$ref: $ref('error'),
	},
		// {
		//	 type: type.object,
		//	 properties: {
		//		 failedValidation: {
		//			 type: type.boolean,
		//		 },
		//		 paramName: {
		//			 type: type.string,
		//		 },
		//		 path: {
		//			 type: type.array,
		//			 items: {
		//				 type: type.string,
		//			 },
		//		 },
		//		 results: {
		//			 type: type.object,
		//			 properties: {
		//				 errors: {
		//					 type: type.array,
		//					 items: {
		//						 $ref: $ref('errorFieldDescription'),
		//					 },
		//				 },
		//				 warnings: {
		//					 type: type.array,
		//					 items: {
		//						 $ref: $ref('errorFieldDescription'),
		//					 },
		//				 },
		//			 },
		//		 },
		//	 },
		// },
	],
}

export default validationError
