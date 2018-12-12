import crypto from 'crypto'
import NodeRSA from 'node-rsa'
import fs from 'fs'
import path from 'path'

class Crypter {
	sortQuery(query) {
		const keys = Object.keys(query)
		keys.sort()
		const keypairs = []
		for (const key of keys) {
			const value = query[key]
			const pair = `${key}=${value}`
			keypairs.push(pair)
		}
		return keypairs.join('&')
	}

	rsaSign(text) {
		const env = process.env.NODE_ENV || 'development'
		const file = path.join(__dirname, '../..', 'cert', env, 'alipay', 'rsa_private_key.pem')
		const privateKey = fs.readFileSync(file, 'utf8')
		const key = new NodeRSA(privateKey)
		return key.encrypt(text, 'base64')
	}

	sign(text, algo) {
		const signAlgo = algo || 'sha1'
		if (signAlgo === 'RSA') return this.rsaSign(text)
		const buffer = new Buffer(1024)
		const length = buffer.write(text, 0)
		const hash = crypto.createHash(signAlgo)
		hash.update(buffer.toString('binary', 0, length))
		return hash.digest('hex')
	}

	decryptMsg(text, encodingKey) {
		const AESKey = new Buffer(`${encodingKey}=`, 'base64')
		const IV = AESKey.slice(0, 16)
		const decipher = crypto.createDecipheriv('aes-256-cbc', AESKey, IV)
		decipher.setAutoPadding(false)
		const deciphered = Buffer.concat([decipher.update(text, 'base64'), decipher.final()])
		const content = deciphered.slice(16)
		const length = content.slice(0, 4).readUInt32BE(0)
		return content.slice(4, length + 4).toString()
	}
}

export default new Crypter()
