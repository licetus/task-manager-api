import { type as T } from '../../constants'
import { imageUrl } from './properties'

export const imageResponse = {
	description: 'upload image response',
	type: T.object,
	properties: {
		imageUrl,
	},
}
