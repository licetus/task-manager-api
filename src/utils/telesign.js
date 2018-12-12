import TeleSignSDK from 'telesignsdk'

export const send = async (phoneNumber, verifyCode) => {
	const teleConfig = global.config.thirdParty.teleSign
	const customerId = teleConfig.customerId
	const apiKey = teleConfig.apiKey
	const restEndpoint = teleConfig.endPoint
	const timeout = 10 * 1000 // 10 secs

	const client = new TeleSignSDK(
		customerId,
		apiKey,
		restEndpoint,
		timeout, // optional
		// userAgent
	)

	const messageType = 'ARN'
	const message = `「AEROLINK」Your Verification code is: ${verifyCode}`

	global.logger.trace('start send verify code sms', phoneNumber, verifyCode)

	return new Promise((resolve, reject) => {
		client.sms.message((error, response) => {
			if (error == null) {
				global.logger.info(`Messaging response for messaging phone number: ${phoneNumber} => code: ${response.status.code}, description: ${response.status.description}`)
				resolve(response.result)
			} else {
				global.logger.error(`Unable to send message. ${error}`)
				reject(error.message)
			}
		}, phoneNumber, message, messageType)
	})
}
