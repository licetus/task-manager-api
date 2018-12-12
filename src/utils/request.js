import request from 'request'

const complete = (resolve, reject) => (err, response, body) => {
	if (err) {
		return reject(err)
	}
	const headers = response.headers
	const contentType = headers['Content-Type'] || headers['content-type']
	if (contentType && contentType.indexOf('json') > -1) {
		try {
			if (typeof(body) === 'string') {
				body = JSON.parse(body)
			}
		} catch (e) {
			reject({
				error: 'InvalidJSONError',
				message: '返回的数据不是有效的JSON格式',
			})
		}
	}
	const statusCode = response.statusCode
	if (/^2|304/.test(statusCode)) {
		return resolve(body)
	}
	const error = body
	error.statusCode = statusCode
	return reject(error)
}

const get = url => new Promise((resolve, reject) => {
	request(url, complete(resolve, reject))
})

const post = (url, body) => new Promise((resolve, reject) => {
	const opt = { url }
	if (typeof body === 'object') {
		if (body.$xml) {
			// body.xml 是 string 类型
			opt.body = body.$xml
			opt.headers = {
				'content-type': 'text/xml',
			}
		} else if (body.$form) {
			opt.form = body.$form
		} else {
			opt.json = body
		}
	} else {
		// 字符串类型
		opt.body = body
		opt.headers = {
			'content-type': 'text/plain',
		}
	}
	request.post(opt, complete(resolve, reject))
})

export default { get, post }
