import path from 'path'
import webpack from 'webpack'

const DEBUG = !process.argv.includes('release')
const VERBOSE = process.argv.includes('verbose')
const GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	__DEV__: DEBUG,
}

// 打入 babel 所需要的 runtime，生产环境不再需要安装 babel packages
const compiledPackages = [
	'babel-regenerator-runtime',
	'babel-runtime/regenerator',
	'babel-runtime/helpers/asyncToGenerator',
	'babel-runtime/helpers/extends',
	'babel-runtime/core-js/json/stringify',
	'babel-runtime/core-js/object/keys',
	'babel-runtime/core-js/promise',
	'babel-runtime/core-js/get-iterator',
	'babel-runtime/helpers/classCallCheck',
	'babel-runtime/helpers/createClass',
	'babel-runtime/helpers/slicedToArray',
	'babel-runtime/helpers/toConsumableArray',
	'babel-runtime/helpers/typeof',
]

const config = {
	context: path.resolve(__dirname, '../src'),

	entry: './start.js',

	output: {
		path: path.resolve(__dirname, '../build'),
		filename: 'server.js',
		libraryTarget: 'commonjs2',
	},

	target: 'node',

	externals: [
		function filter(context, request, cb) {
			let isExternal =
				compiledPackages.indexOf(request) === -1 &&
				request.match(/^[a-z][a-z\/\.\-0-9]*$/i)
			if (!isExternal && request === './config') {
				isExternal = true
			}
			if (!isExternal && request.match(/\.json$/)) {
				const f = path.join(context, request)
				const c = path.resolve(__dirname, '../src/config')
				isExternal = f.indexOf(c) === 0
			}
			if (request.indexOf('babel') !== -1 && !!isExternal) {
				console.log(`\x1B[31m[WARNNING]: ${request} isn't included\x1B[39m`)
			}
			cb(null, !!isExternal)
		},
	],

	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.BannerPlugin({
			banner: 'require("source-map-support").install()',
			raw: true,
			entryOnly: false,
		}),
	],

	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
	},

	devtool: DEBUG ? 'cheap-module-source-map' : 'source-map',

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, '../src'),
				],
				query: {
					// https://github.com/babel/babel-loader#options
					cacheDirectory: DEBUG,
				},
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
			{
				test: /\.txt$/,
				loader: 'raw-loader',
			},
		],
	},

	resolve: {
		modules: [
			path.resolve(__dirname, '../src'),
			'node_modules',
		],
		extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
	},

	cache: DEBUG,

	stats: {
		colors: true,
		reasons: DEBUG,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE,
	},

}

const createCronJobConfig = (job) => {
	return Object.assign({}, config, {
		context: path.resolve(__dirname, '../src/cron'),
		entry: `./${job}.js`,
		output: {
			path: path.resolve(__dirname, '../build/cron'),
			filename: `${job}.js`,
			libraryTarget: 'commonjs2',
		},
		externals: [
			function filter(context, request, cb) {
				let isExternal =
					compiledPackages.indexOf(request) === -1 &&
					request.match(/^[a-z][a-z\/\.\-0-9]*$/i)
				if (!isExternal && request === '../config') {
					isExternal = true
				}
				if (!isExternal && request.match(/\.json$/)) {
					const f = path.join(context, request)
					const c = path.resolve(__dirname, '../src/config')
					isExternal = f.indexOf(c) === 0
				}
				if (request.indexOf('babel') !== -1 && !!isExternal) {
					console.log(`\x1B[31m[WARNNING]: ${request} isn't included\x1B[39m`)
				}
				cb(null, !!isExternal)
			},
		],
	})
}

export default [
	config,
	createCronJobConfig('product'),
]
