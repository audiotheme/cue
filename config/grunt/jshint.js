module.exports = {
	options: {
		jshintrc: '.jshintrc'
	},
	check: [
		'{,admin/}assets/js/{,**/}*.js',
		'!{,admin/}assets/js/*.{bundle,min}.js',
		'!assets/js/vendor/*.js'
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
