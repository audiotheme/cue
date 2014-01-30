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
				src: 'assets/styles/cue.min.css'
			},
			admin: {
				src: 'admin/assets/styles/admin.min.css'
			}
		},

		cssmin: {
			plugin: {
				files: [
					{
						src: 'assets/styles/cue.min.css',
						dest: 'assets/styles/cue.min.css'
					},
					{
						src: 'admin/assets/styles/admin.min.css',
						dest: 'admin/assets/styles/admin.min.css'
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
				'assets/scripts/*.js',
				'admin/assets/scripts/*.js',
				'!assets/scripts/*.min.js',
				'!admin/assets/scripts/*.min.js'
			]
		},

		sass: {
			plugin: {
				options: {
					outputStyle: 'expanded'
				},
				files: [
					{
						src: 'assets/styles/sass/cue.scss',
						dest: 'assets/styles/cue.min.css'
					},
					{
						src: 'admin/assets/styles/sass/admin.scss',
						dest: 'admin/assets/styles/admin.min.css'
					}
				]
			}
		},

		uglify: {
			plugin: {
				files: [
					{
						src: [
							'assets/scripts/cue-mejs.js',
							'assets/scripts/cue-media-classes.js',
							'assets/scripts/cue.js'
						],
						dest: 'assets/scripts/cue.min.js'
					},
					{
						src: [
							'admin/assets/scripts/cue.js',
							'admin/assets/scripts/workflows.js',
							'admin/assets/scripts/models.js',
							'admin/assets/scripts/views.js'
						],
						dest: 'admin/assets/scripts/cue.min.js'
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
					'assets/styles/sass/*.scss',
					'admin/assets/styles/sass/*.scss'
				],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			}
		}

	});

	grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'watch']);

};
