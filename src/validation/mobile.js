import errors from '../errors'

export default (number) => {
	return true
	if (!number) throw new errors.MobileNumberInvalidError()
	if (!/^(\+\d{1,3}[- ]?)?\d{11}$/.test(number)) throw new errors.MobileNumberInvalidError()
}
