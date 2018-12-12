import { $ref, contentType } from '../../constants'

const file = {
	post: {
		operationId: 'uploadFile',
		tags: ['Media'],
		summary: 'Upload file',
		description: `upload file form data, sample code: <br />
		\`const data = new window.FormData()\`<br />
		\`data.append('file', file)\`<br />
		\`createAuthInstance().post('media/file', data)\``,
		consumes: [contentType.formData],
		produces: [contentType.json],
		responses: {
			200: {
				description: 'return 200 if succeed',
				schema: {
					$ref: $ref('imageResponse'),
				},
			},
		},
	},
}

export default file
