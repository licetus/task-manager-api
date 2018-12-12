import isPromise from 'is-promise'
import doc from './document'
import media from './media'

const controllers = {
	...doc,
	...media,
}

// this exported controllers is for swatter-tools, but it cannot deal with exception in async
// calls, so wrap it here to make the error can be process
export default Object.keys(controllers)
	.reduce((syncControllers, operationId) => {
		syncControllers[operationId] = (req, res, next) => {
			const result = controllers[operationId](req, res, next)
			if (isPromise(result)) {
				return result.catch(next)
			}
			return result
		}
		return syncControllers
	}, {})
