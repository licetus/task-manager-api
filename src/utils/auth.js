import errors from '../errors'

export const requireCurrentAccount = (req) => {
	const id = req.credentials && req.credentials.id
	const role = req.credentials && req.credentials.role
	if (!id || !role) throw new errors.NotAuthorizeError()
	return { id, role }
}

export const checkSuperAdmin = (req) => {
	const { Admin } = global.models
	const { role } = requireCurrentAccount(req)
	global.logger.trace('checkSuperAdmin', role)
	if (role !== Admin.Role.SuperAdmin) throw new errors.NotAuthenticateError()
}

export const checkAdmin = (req) => {
	const { Admin } = global.models
	const { role } = requireCurrentAccount(req)
	global.logger.trace('checkAdmin', role)
	if (role !== Admin.Role.SuperAdmin && role !== Admin.Role.Admin) throw new errors.NotAuthenticateError()
}

export const checkOperator = (req) => {
	const { Admin } = global.models
	const { role } = requireCurrentAccount(req)
	global.logger.trace('checkAgent', role)
	if (role !== Admin.Role.SuperAdmin && role !== Admin.Role.Admin && role !== Admin.Role.Operator) throw new errors.NotAuthenticateError()
}

export const checkAgent = (req) => {
	const { Admin } = global.models
	const { role } = requireCurrentAccount(req)
	global.logger.trace('checkAgent', role)
	if (role !== Admin.Role.SuperAdmin && role !== Admin.Role.Admin && role !== Admin.Role.Operator && role !== Admin.Role.Agent) throw new errors.NotAuthenticateError()
}

export const checkUser = (req) => {
	const { Admin } = global.models
	const { role } = requireCurrentAccount(req)
	global.logger.trace('checkUser', role)
	if (role !== Admin.Role.User) throw new errors.NotAuthenticateError()
}

export const checkAdminAndUser = (req) => {
	const { Admin } = global.models
	const { role } = requireCurrentAccount(req)
	global.logger.trace('checkAdmin', role)
	if (role !== Admin.Role.SuperAdmin && role !== Admin.Role.Admin && role !== Admin.Role.User) throw new errors.NotAuthenticateError()
}
