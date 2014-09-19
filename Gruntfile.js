/*global exports:false, module:false, require:false */

module.exports = function( grunt ) {
	'use strict';

	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({

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
						poedit: true
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
						src: 'assets/css/sass/cue.scss',
						dest: 'assets/css/cue.min.css'
					},
					{
						src: 'admin/assets/css/sass/admin.scss',
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
					'assets/css/sass/*.scss',
					'admin/assets/css/sass/*.scss'
				],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			}
		}

	});

	grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'watch']);

};
