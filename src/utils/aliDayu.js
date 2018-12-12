import { Client } from 'taobao-sdk'
import { camelCase2underlineCase } from './index'

export const send = async (phoneNumber, verifyCode) => {
	const dayuConfig = global.config.thirdParty.aliDayu
	const smsType = 'normal'
	const smsFreeSignName = dayuConfig.signName
	const recNum = phoneNumber.replace(/^(\+86|086)/, '')
	const smsTemplateCode = dayuConfig.templateCode

	const smsParam = JSON.stringify({
		number: `${verifyCode}`,
	})

	const client = new Client({
		REST_URL: 'http://gw.api.taobao.com/router/rest',
		appkey: dayuConfig.appKey,
		appsecret: dayuConfig.appSecret,
	})

	return new Promise((resolve, reject) => {
		const params = camelCase2underlineCase({
			smsType,
			smsFreeSignName,
			smsParam,
			recNum,
			smsTemplateCode,
		})
		client.execute('alibaba.aliqin.fc.sms.num.send', params, (error, response) => {
			if (!error) resolve(response.result)
			else reject(error.message)
		})
	})
}

export default { send }
