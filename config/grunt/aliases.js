module.exports = function( grunt, options ) {
	return {
		'default': [
			'build'
		],
		'build': [
			'clean',
			'check',
			'build:css',
			'build:js'
		],
		'build:css': [
			'sass',
			'cssmin'
		],
		'build:js': [
			'uglify',
		],
		'check': [
			'jshint'
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
