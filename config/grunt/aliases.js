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
			'browserify:build',
			'uglify',
		],
		'check': [
			'jshint'
		],
		'develop:js': [
			'browserify:develop'
		],
		'package': [
			'check',
			'string-replace:release',
			'build:css',
			'build:js',
			'addtextdomain',
			'compress:package'
		]
	};
};
