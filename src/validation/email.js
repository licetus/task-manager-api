import errors from '../errors'

export default (email) => {
	if (!email) throw new errors.EmailInvalidError()
	if (!/^[\d\w._+]+@[\d\w.-]+$/.test(email)) { // TODO email verification
		throw new errors.EmailInvalidError()
	}
}
