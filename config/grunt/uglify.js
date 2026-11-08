module.exports = {
	options: {
		// uglify-js 3.18+ treats input as an ES module by default, which adds
		// strict mode semantics. grunt-contrib-uglify doesn't pass the top-level
		// `module` option, so turn it off for each step instead.
		compress: { module: false },
		output: { module: false },
		parse: { module: false }
	},
	build: {
		files: [
			{
				src: [
					'assets/js/cue-mejs.js',
					'assets/js/cue-media-classes.js',
					'assets/js/cue.js'
				],
				dest: 'assets/js/cue.min.js'
			},
			{
				src: [
					'admin/assets/js/playlist-edit.bundle.js',
				],
				dest: 'admin/assets/js/playlist-edit.bundle.min.js'
			},
			{
				src: [
					'admin/assets/js/wp-media.bundle.js',
				],
				dest: 'admin/assets/js/wp-media.bundle.min.js'
			}
		]
	}
};
