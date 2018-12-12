const test = {
	get: {
		operationId: 'test',
		tags: ['Test'],
		summary: 'Test',
		responses: {
			200: {
				description: 'return 200 if succeed',
			},
			// ...generateErrorResponses([
			// 	errors.InvalidIdentificationError,
			// ]),
		},
	},
}

export default test
