import { assemblePath } from '../utils'
import test from './test'
import media from './media'
import doc from './document'
import task from './task'

const routes = {
	test,
	...media,
	...doc,
	...task,
}

const basePath = ''

export default assemblePath(routes, basePath)
