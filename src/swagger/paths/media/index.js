import { assemblePath } from '../../utils'

import file from './file'

const routes = {
	file,
}

const basePath = 'media'

export default assemblePath(routes, basePath)
