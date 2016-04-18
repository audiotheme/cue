module.exports = {
	options: {
		jshintrc: 'config/.jshintrc'
	},
	check: [
		'assets/js/*.js',
		'assets/js/**/*.js',
		'!assets/js/*.bundle.js',
		'!assets/js/*.min.js',
		'!assets/js/vendor/*.js',
		'admin/assets/js/*.js',
		'!admin/assets/js/*.min.js'
	],
	grunt: {
		options: {
			jshintrc: 'config/.jshintnoderc'
		},
		src: [
			'Gruntfile.js',
			'config/grunt/*.js'
		]
	}
};
