import qiniu from 'qiniu'
import log4js from 'log4js'
import errors from '../errors'
import { decodeQueryString, queryString } from './index'

const log = log4js.getLogger()

const uptoken = (bucket, key, callbackUrl, extraCallbackInfo = null) => {
	const qiniuConfig = global.config.thirdParty.qiniu
	const putPolicy = new qiniu.rs.PutPolicy(key ? `${bucket}:${key}` : bucket)
	// putPolicy.callbackUrl = callbackUrl
	// putPolicy.callbackBody = 'key=$(key)'
	putPolicy.returnBody = `{"key": "http://${qiniuConfig.domain}/\$(key)"}`
	if (extraCallbackInfo !== null) {
		putPolicy.callbackBody += `&${queryString(extraCallbackInfo)}`
	}
	return putPolicy.token()
}

export const getUploadToken = (key, extraCallbackInfo) => {
	const qiniuConfig = global.config.thirdParty.qiniu
	qiniu.conf.ACCESS_KEY = qiniuConfig.accessKey
	qiniu.conf.SECRET_KEY = qiniuConfig.secretKey
	const bucket = qiniuConfig.bucket
	const callbackUrl = qiniuConfig.callbackUrl
	const token = uptoken(bucket, key, callbackUrl, extraCallbackInfo)
	return token
}

const upload = (file, key) =>
	new Promise((resolve, reject) => {
		const token = getUploadToken(key)
		const extra = new qiniu.io.PutExtra()
		extra.mimeType = file.mimetype
		qiniu.io.put(token, key, file.buffer, extra, (err, result) => {
			if (err) {
				reject(err)
				return
			}
			resolve(result)
		})
	})

export const validateCallback = (req) => {
	const qiniuConfig = global.config.thirdParty.qiniu
	qiniu.conf.ACCESS_KEY = qiniuConfig.accessKey
	qiniu.conf.SECRET_KEY = qiniuConfig.secretKey
	const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
	const { generateAccessToken } = qiniu.util
	const expredAuthHeader = generateAccessToken(url, req.body)
	const actualAuthHeader = req.get('Authorization')
	if (expredAuthHeader !== actualAuthHeader) {
		log.info(`Invalid header was found in postUploadCallback: ${expredAuthHeader} !== ${
			actualAuthHeader}`)
		throw new errors.BadRequestError()
	}
	const info = decodeQueryString(req.body)
	return info
}

export default upload
