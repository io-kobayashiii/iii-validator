const path = require('path')
module.exports = {
	mode: 'production',
	entry: './src/Validator.ts',
	output:{
		path: path.resolve(__dirname),
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: {
					loader: 'ts-loader'
				},
			},
		],
	},
	resolve: {
		extensions: [
			'.ts', '.js',
		],
	},
}