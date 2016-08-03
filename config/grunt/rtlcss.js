module.exports = {
	options: {
		opts: {
			autoRename: false,
			clean: false,
			processUrls: { atrule: true, decl: false },
		},
		saveUnmodified: false
	},
	build: {
		files: [
			{
				src: 'assets/css/cue.min.css',
				dest: 'assets/css/cue-rtl.min.css'
			}
		]
	}
};
