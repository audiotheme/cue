module.exports = {
	check: [
		'{,admin/}assets/js/{,**/}*.js',
		'!{,admin/}assets/js/*.{bundle,min}.js',
		'!assets/js/vendor/*.js'
	]
};
