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
					'admin/assets/js/cue.js',
					'admin/assets/js/workflows.js',
					'admin/assets/js/models.js',
					'admin/assets/js/views.js'
				],
				dest: 'admin/assets/js/cue.min.js'
			}
		]
	}
};
