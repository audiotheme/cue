var config,
	_ = require( 'lodash' );

config = {
	build: {
		options: {
			alias: {
				cue: './admin/assets/js/modules/application.js'
			},
			watch: true
		},
		files: [
			{
				src: 'admin/assets/js/playlist-edit.js',
				dest: 'admin/assets/js/playlist-edit.bundle.js'
			},
			{
				src: 'admin/assets/js/wp-media.js',
				dest: 'admin/assets/js/wp-media.bundle.js'
			}
		]
	}
};

config.develop = _.cloneDeep(config.build );
config.develop.options.keepAlive = true;

module.exports = config;
