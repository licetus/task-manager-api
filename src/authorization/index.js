import { errors } from 'task-manager-model'
import jwt from 'jsonwebtoken'

errors.register({
	ApiAuthKeyIsMissing: 401,
	InvalidAuthKey: 401,
})

export const apiKeyAuth = (req, authOrSecDef, scopesOrApiKey, next) => {
	if (!scopesOrApiKey) {
		next(new errors.ApiAuthKeyIsMissingError())
		return
	}

	const { config } = global

	try {
		const credentials = jwt.verify(scopesOrApiKey, config.secret.jwt)
		req.credentials = credentials
		next()
	} catch (err) {
		next(new errors.InvalidAuthKeyError())
	}
}

export const getToken = (id, role) => {
	const { config } = global
	return jwt.sign({ id, role }, config.secret.jwt, config.jwtOptions)
}
