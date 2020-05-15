const webpack = require( 'webpack' );
const EOLPlugin = require( './config/webpack/eol-plugin' );
const mode = process.env.NODE_ENV || 'development';

const config = {
	mode: mode,
	entry: {
		'editor': './admin/assets/js/editor.js',
		'playlist-edit': './admin/assets/js/playlist-edit.js',
		'wp-media': './admin/assets/js/wp-media.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: __dirname + '/admin/assets/js'
	},
	externals: {
		_: '_',
		backbone: 'Backbone',
		jquery: 'jQuery',
		lodash: 'lodash',
		mediaelementjs: 'mejs',
		underscore: '_',
		wp: 'wp'
	},
	resolve: {
		alias: {
			cue: __dirname + '/admin/assets/js/modules/application.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		new EOLPlugin()
	]
};

switch ( process.env.NODE_ENV ) {
	case 'production':
		config.plugins.push( new webpack.optimize.UglifyJsPlugin() );
		break;

	default:
		config.devtool = 'source-map';
}

module.exports = config;
