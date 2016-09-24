module.exports = {
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
