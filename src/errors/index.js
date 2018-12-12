import { errors } from 'task-manager-model'

const localization = require('./locale.zh-cn.json')

errors.localization = Object.keys(localization).reduce((previousLocalization, key) => {
	previousLocalization[key] = localization[key]
	return previousLocalization
}, errors.localization)

errors.register({
	NotAuthorize: 401,
	NotAuthenticate: 403,
	EmailInvalid: 400,
	MobileNumberInvalid: 400,
	AccountExist: 400,
	NoFileFound: 400,
	SaveFileFailed: 400,
	FileSizeExtendLimit: 400,

	SuperAdmin: 400,

	DeleteDebtorLoanExists: 400,

	LoanDoesNotExist: 400,
	ProductAlreadyExist: 400,
	UpdateLoanFailedInvalidStatus: 400,
	UpdateLoanFailedNotApproved: 400,
	DeleteProductFailedInvalidStatus: 400,

	PublishProductFailed: 400,
	CancelProductFailed: 400,
	PauseProductFailed: 400,
	ResumeProductFailed: 400,

	InvestProductDoesNotExist: 400,
	InvestProductIsNotOnSale: 400,
	InvestInsufficientAmount: 400,
	InvestLessThanMinInvestment: 400,
})

export default errors
