/*global exports:false, module:false, require:false */

module.exports = function( grunt ) {
	'use strict';

	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({

		addtextdomain: {
			target: {
				options: {
					updateDomains: ['all']
				},
				files: {
					src: [
						'*.php',
						'**/*.php',
						'!node_modules/**'
					]
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8', 'android 4']
			},
			plugin: {
				src: 'assets/css/cue.min.css'
			},
			admin: {
				src: 'admin/assets/css/admin.min.css'
			}
		},

		cssmin: {
			plugin: {
				files: [
					{
						src: 'assets/css/cue.min.css',
						dest: 'assets/css/cue.min.css'
					},
					{
						src: 'admin/assets/css/admin.min.css',
						dest: 'admin/assets/css/admin.min.css'
					}
				]
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			plugin: [
				'Gruntfile.js',
				'assets/js/*.js',
				'admin/assets/js/*.js',
				'!assets/js/*.min.js',
				'!admin/assets/js/*.min.js'
			]
		},

		makepot: {
			plugin: {
				options: {
					mainFile: 'cue.php',
					potHeaders: {
						language: 'en',
						'plural-forms': 'nplurals=2; plural=(n != 1);',
						poedit: true
					},
					processPot: function( pot ) {
						var translation,
							excluded_meta = [
								'Plugin Name of the plugin/theme',
								'Plugin URI of the plugin/theme',
								'Author of the plugin/theme',
								'Author URI of the plugin/theme'
							];

						for ( translation in pot.translations[''] ) {
							if ( 'undefined' !== typeof pot.translations[''][ translation ].comments.extracted ) {
								if ( excluded_meta.indexOf( pot.translations[''][ translation ].comments.extracted ) >= 0 ) {
									console.log( 'Excluded meta: ' + pot.translations[''][ translation ].comments.extracted );
									delete pot.translations[''][ translation ];
								}
							}
						}

						return pot;
					},
					type: 'wp-plugin'
				}
			}
		},

		sass: {
			plugin: {
				options: {
					outputStyle: 'expanded'
				},
				files: [
					{
						src: 'assets/sass/cue.scss',
						dest: 'assets/css/cue.min.css'
					},
					{
						src: 'admin/assets/sass/admin.scss',
						dest: 'admin/assets/css/admin.min.css'
					}
				]
			}
		},

		uglify: {
			plugin: {
				files: [
					{
						src: [
							'assets/js/cue-mejs.js',
							'assets/js/cue-media-classes.js',
							'assets/js/cue.js'
						],
						dest: 'assets/js/cue.min.js'
					},
					{
						src: [
							'admin/assets/js/cue.js',
							'admin/assets/js/workflows.js',
							'admin/assets/js/models.js',
							'admin/assets/js/views.js'
						],
						dest: 'admin/assets/js/cue.min.js'
					}
				]
			}
		},

		watch: {
			js: {
				files: ['<%= jshint.plugin %>'],
				tasks: ['jshint', 'uglify']
			},
			sass: {
				files: [
					'assets/sass/*.scss',
					'assets/sass/**/*.scss',
					'admin/assets/sass/*.scss'
				],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			}
		}

	});

	grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'watch']);

};
