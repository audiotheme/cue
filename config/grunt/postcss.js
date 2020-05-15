var autoprefixer = require( 'autoprefixer' );

module.exports = {
	options: {
		processors: [
			autoprefixer({
				cascade: false
			})
		]
	},
	build: {
		src: [
			'assets/css/cue.min.css',
			'admin/assets/css/admin.min.css'
		]
	}
};
