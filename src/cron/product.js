// import log4js from 'log4js'
// import models, { configure } from 'task-manager-model'
// import config from '../config'
//
// async function run() {
// 	const log = log4js.getLogger()
// 	await configure(config)
// 	const { Product, Investment, ExpectedReturn } = models
// 	try {
// 		const filters = [`productStatus=${Product.Status.SoldOut}`]
// 		const investments = await new Investment().getViewList('view_investment_product', 'id', { filters })
// 		const er = new ExpectedReturn()
// 		const reqs = investments.map(item => er.batchInsert(item.id, item.termType, item.amount, (item.interestRateBase + item.interestRateDelta)))
// 		await Promise.all(reqs)
// 		const result = await new Product().setProductsRunningFromSoldOut()
// 		log.info(`${result.rowCount} product updated`)
// 		process.exit(0)
// 	} catch (err) {
// 		log.error(err)
// 		process.exit(-1)
// 	}
// }
//
// run()
