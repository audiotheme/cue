module.exports = {
	release: {
		options: {
			updateDomains: [ 'all' ]
		},
		files: {
			src: [
				'*.php',
				'**/*.php',
				'!dist/**',
				'!node_modules/**',
				'!svn/**',
				'!tests/**',
				'!vendor/**'
			]
		}
	}
};
