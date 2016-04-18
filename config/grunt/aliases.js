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
			'cssmin'
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
		'release': [
			'check',
			'string-replace:release',
			'build:css',
			'build:js',
			'addtextdomain',
			'makepot'
		]
	};
};
