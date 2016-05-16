module.exports = {
	package: {
		options: {
			archive: 'dist/<%= package.name %>-<%= package.version %>.zip'
		},
		files: [
			{
				src: [
					'**',
					'!admin/assets/sass/**',
					'!assets/sass/**',
					'!config/**',
					'!dist/**',
					'!node_modules/**',
					'!tests/**',
					'!.editorconfig',
					'!.esformatter',
					'!.gitignore',
					'!composer.*',
					'!gruntfile.js',
					'!Gruntfile.js',
					'!package.json',
					'!phpcs.log',
					'!phpcs.xml',
					'!phpunit.xml',
					'!README.md',
					'!shipitfile.js'
				],
				dest: '<%= package.name %>/'
			}
		]
	}
};
