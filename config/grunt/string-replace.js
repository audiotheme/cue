module.exports = {
	release: {
		options: {
			replacements: [
				{
					pattern: /(Version:[\s]+).+/,
					replacement: '$1<%= package.version %>'
				}
			]
		},
		files: {
			'cue.php': 'cue.php'
		}
	}
};
