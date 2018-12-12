import nodemailer from 'nodemailer'
import gmailSend from 'gmail-send'


let transporter = null

export const sendMainSync = (to, subject, html) => {
	const { config } = global
	if (transporter === null) {
		const mailConfig = config.thirdParty.qq
		transporter = nodemailer.createTransport({
			host: mailConfig.host,
			port: mailConfig.port,
			secure: mailConfig.secure,
			auth: mailConfig.auth,
		})
	}
	transporter.sendMail({ from: config.thirdParty.qq.from, to, subject, html }, (error, info) => {
		const message = `Send mail to ${to}`
		global.logger.info(message)
		if (error) {
			global.logger.error(error)
		} else {
			global.logger.info(info)
		}
	})
}

export const sendMailAsync = (to, subject, html) => new Promise((resolve, reject) => {
	const { config } = global
	if (transporter === null) {
		const mailConfig = config.thirdParty.qq
		transporter = nodemailer.createTransport({
			host: mailConfig.host,
			port: mailConfig.port,
			secure: mailConfig.secure,
			auth: mailConfig.auth,
		})
	}
	const options = { from: config.thirdParty.qq.from, to, subject, html }
	transporter.sendMail(options, (error, info) => {
		const message = `Send mail to ${to}`
		global.logger.info(message)
		if (error) {
			return reject(error)
		}
		global.logger.info(info)
		return resolve(info)
	})
})

export const sendGmailAsync = (to, subject, html) => new Promise((resolve, reject) => {
	global.logger.info('send gmail async')
	const { config } = global
	const mailConfig = config.thirdParty.smtp
	const send = gmailSend({
		user: mailConfig.auth.user,
		pass: mailConfig.auth.pass,
		to,
		subject,
		html,
	})
	send({ }, (err, res) => {
		if (err) {
			return reject(err)
		}
		global.logger.info(res)
		return resolve(res)
	})
})
