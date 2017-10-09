const webpack = require( 'webpack' );

const config = {
	entry: {
		'playlist-edit': './admin/assets/js/playlist-edit.js',
		'wp-media': './admin/assets/js/wp-media.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: __dirname + '/admin/assets/js'
	},
	externals: {
		backbone: 'Backbone',
		jquery: 'jQuery',
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
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: []
};

// switch ( process.env.NODE_ENV ) {
// 	case 'production':
// 		config.plugins.push( new webpack.optimize.UglifyJsPlugin() );
// 		break;
//
// 	default:
// 		config.devtool = 'source-map';
// }

module.exports = config;
