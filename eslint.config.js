const globals = require( 'globals' );
const wordpress = require( 'eslint-config-wordpress' );

module.exports = [
	{
		ignores: [
			'**/*.bundle.js',
			'**/*.min.js',
			'assets/js/vendor/**',
			'dist/**',
			'node_modules/**',
			'svn/**'
		]
	},
	{
		files: [ '**/*.js' ],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.browser,
				...globals.es2015,
				...wordpress.globals
			}
		},
		linterOptions: {
			// ESLint 7 didn't report unused disable comments.
			reportUnusedDisableDirectives: 'off'
		},
		rules: {
			...wordpress.rules,
			// Allow snake_case properties required by WordPress and the server,
			// like _ajax_nonce, post_id, and mime_types.
			camelcase: [ 'error', { properties: 'never' } ],
			// WordPress only requires Yoda conditions for equality checks.
			yoda: [ 'error', 'always', { onlyEquality: true } ]
		}
	}
];
