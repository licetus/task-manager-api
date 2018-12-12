import { assemblePath } from '../utils'
import test from './test'
import media from './media'
import doc from './document'

const routes = {
	test,
	...media,
	...doc,
}

const basePath = ''

export default assemblePath(routes, basePath)
