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
