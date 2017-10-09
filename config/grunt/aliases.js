module.exports = function( grunt, options ) {
	return {
		'default': [
			'build'
		],
		'build': [
			'check',
			'build:css',
			'build:js'
		],
		'build:css': [
			'sass',
			'cssmin',
			'rtlcss'
		],
		'build:js': [
			'webpack:build',
			'uglify',
		],
		'check': [
			'jshint'
		],
		'develop:js': [
			'webpack:develop'
		],
		'package': [
			'check',
			'replace',
			'build:css',
			'build:js',
			'addtextdomain',
			'compress:package'
		]
	};
};
