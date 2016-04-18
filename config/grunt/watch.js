module.exports = {
	sass: {
		files: [
			'{,admin/}assets/sass/{,**/}*.scss'
		],
		tasks: [ 'sass', 'postcss' ]
	}
};
