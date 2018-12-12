import cors from 'cors'
import express from 'express'
import swaggerTools from 'swagger-tools'
import log4js from 'log4js'
import models, { configure } from 'task-manager-model'
import fileUpload from 'express-fileupload'

import errors from './errors'
import config from './config'
import swagger from './swagger'
import controllers from './controllers'
import { apiKeyAuth } from './authorization'
import { camelCase2underlineCase } from './utils'

global.models = models

global.config = config

const instance = process.env.NODE_APP_INSTANCE

log4js.configure({
	appenders: {
		out: { type: 'stdout', level: 'trace' },
		logFile: {
			type: 'dateFile', filename: 'logs/api', pattern: 'yyyyMMdd.log', alwaysIncludePattern: true, level: 'trace',
		},
	},
	categories: {
		default: { appenders: ['logFile', 'out'], level: 'trace' },
	},
})

const logger = log4js.getLogger()
global.logger = logger

async function server() {
	const { __TEST__ } = global
	if (!__DEV__) {
		logger.setLevel('INFO')
	}

	let { port } = config.server
	if (instance) port += instance

	swagger.host = config.swagger.host
	swagger.schemes = config.swagger.schemes

	// Create or update db version
	try {
		const manager = await configure(config)
		await manager.update()
		logger.info(`database version: ${manager.version}`)
	} catch (err) {
		return logger.error(err)
	}

	const app = express()

	const corsOptions = {
		origin: true,
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Key'],
		preflightContinue: false,
		optionsSuccessStatus: 200,
	}

	app.use(cors(corsOptions))
	app.use(fileUpload({ limits: { fileSize: 500 * 1024 * 1024 } }))
	const apiRouter = new express.Router()

	if (__DEV__ && !__TEST__) {
		const logMiddleware = log4js.connectLogger(
			logger,
			{ level: 'auto', format: ':method :url :status :response-timems' },
		)
		apiRouter.use(/^((?!notification|message).)*$/, logMiddleware)
		// apiRouter.use(/notification|message/, logMiddleware)

		// 开发模式下，模拟网络延迟
		// app.use((req, res, next) => {
		// 	setTimeout(next, 1000)
		// })
	}

	swaggerTools.initializeMiddleware(swagger, (middleware) => {
		// Interpret Swagger resources and attach metadata to request
		// must be first in swagger-tools middleware chain
		apiRouter.use(middleware.swaggerMetadata())

		apiRouter.use(middleware.swaggerSecurity({
			apiKeyAuth,
		}))

		// Validate Swagger requests
		// 2016-06-15 disabled swagger validator due to its low performance
		// apiRouter.use(middleware.swaggerValidator())

		// swaggerRouter configuration
		const options = {
			controllers,
			useStubs: __DEV__ && !__TEST__, // Conditionally turn on stubs (mock mode)
			ignoreMissingHandlers: __DEV__ && !__TEST__,
		}
		// Route validated requests to appropriate controller
		apiRouter.use(middleware.swaggerRouter(options))

		apiRouter.config = config

		apiRouter.use((req, res, next) => {
			if (req.xhr) {
				res.header('Cache-Control', 'max-age=0, private, must-revalidate')
				res.header('Pragma', 'no-cache')
				res.header('Expires', 0)
			}
			next()
		})

		// error handling
		apiRouter.use((err, req, res, next) => {
			if (!err.statusCode && !err.failedValidation) {
				logger.error(err)
			}
			let error = {}
			let statusCode = 500
			if (typeof err === 'string') {
				const e = new errors.InternalError()
				error.code = camelCase2underlineCase(e.name).toUpperCase()
				error.message = `${errors.lang(e)} (${err})` || e.name
			} else if (err.failedValidation) {
				statusCode = 400
				error = err
			} else if (err.name) {
				error.code = camelCase2underlineCase(err.name).toUpperCase()
				error.message = errors.lang(err) || err.name
				statusCode = err.statusCode || statusCode
			} else {
				error.code = err.code
				error.message = err.message
				statusCode = err.statusCode || statusCode
			}
			res.status(statusCode).send({ error })
			next()
		})
	})

	app.use('/docs', express.static('node_modules/swagger-ui/dist'))
	app.use('/files', express.static('files'))

	app.get('/api-docs', (req, res) => {
		res.json(swagger)
	})

	app.use('/', apiRouter)


	if (__TEST__) return app

	return app.listen(port, () => {
		/* eslint-disable no-undef */
		logger.info(`server [${config.name}] running on port: ${port}`)
	})
}

export default () =>
	server().catch((e) => {
		logger.error(e)
		throw e
	})
