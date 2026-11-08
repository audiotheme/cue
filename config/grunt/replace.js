module.exports = {
	headerVersion: {
		src: [
			'cue.php'
		],
		overwrite: true,
		replacements: [
			{
				from: /(Version:[\s]+).+/,
				to: '$1<%= package.version %>'
			},
			{
				from: /(define\( 'CUE_VERSION', ')[^']+(' \);)/,
				to: '$1<%= package.version %>$2'
			}
		]
	},
	readmeVersion: {
		src: [
			'readme.txt'
		],
		overwrite: true,
		replacements: [
			{
				from: /(Stable tag:[\s]+).+/,
				to: '$1<%= package.version %>'
			}
		]
	}
};
