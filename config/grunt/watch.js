module.exports = {
	js: {
		files: [ '<%= jshint.check %>' ],
		tasks: [ 'jshint', 'uglify' ]
	},
	sass: {
		files: [
			'assets/sass/*.scss',
			'assets/sass/**/*.scss',
			'admin/assets/sass/*.scss'
		],
		tasks: [ 'sass', 'autoprefixer', 'cssmin' ]
	}
};
