const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		background: path.resolve(__dirname, 'src/background.js'),
		content: path.resolve(__dirname, 'src/content.js'),
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},

	plugins: [
		new copyWebpackPlugin({
			patterns: [
				{from: "assets"},
				{from: "src/static"}
			]
		})
	]
}