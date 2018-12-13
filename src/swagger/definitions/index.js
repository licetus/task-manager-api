import error from './error'
import errorResponse from './errorResponse'
import validationError from './validationError'
import validationErrorResponse from './validationErrorResponse'
import errorFieldDescription from './errorFieldDescription'
import uploadToken from './uploadToken'

import * as media from './media'
import doc from './document'
import task from './task'

const definitions = {
	error,
	errorResponse,
	validationError,
	validationErrorResponse,
	errorFieldDescription,
	uploadToken,

	...media,
	...doc,
	...task,

}

export default definitions
