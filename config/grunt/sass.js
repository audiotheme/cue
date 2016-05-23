module.exports = {
	build: {
		options: {
			outputStyle: 'expanded'
		},
		files: [
			{
				src: 'assets/sass/cue.scss',
				dest: 'assets/css/cue.min.css'
			},
			{
				src: 'admin/assets/sass/admin.scss',
				dest: 'admin/assets/css/admin.min.css'
			}
		]
	}
};
