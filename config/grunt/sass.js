module.exports = {
	build: {
		options: {
			implementation: require( 'sass' ),
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
			},
			{
				src: 'admin/assets/sass/wp-media.scss',
				dest: 'admin/assets/css/wp-media.min.css'
			}
		]
	}
};
