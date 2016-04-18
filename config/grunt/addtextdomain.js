module.exports = {
	release: {
		options: {
			updateDomains: [ 'all' ]
		},
		files: {
			src: [
				'*.php',
				'**/*.php',
				'!node_modules/**',
				'!tests/**',
				'!vendor/**'
			]
		}
	}
};
