const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		background: path.resolve(__dirname, 'src/background.js'),
		content: path.resolve(__dirname, 'src/content.js'),
		popup: path.resolve(__dirname, 'src/popup.js'),
		option: path.resolve(__dirname, 'src/option.js')
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