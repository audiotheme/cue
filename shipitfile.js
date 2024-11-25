/*global Promise:false */

var fs = require('fs'),
	project = require( __dirname + '/package.json' );

module.exports = function ( shipit ) {
	shipit.initConfig({
		demo: {
			servers: 'audiotheme-demo@demo.audiotheme.com',
			deployRoot: '/sites/demo.audiotheme.com/files/wp-content/plugins/'
		},
		staging: {
			servers: 'deploy@staging.cedaro.com',
			deployRoot: '/srv/www/staging.cedaro.com/public/wp-content/plugins/'
		}
	});

	shipit.task( 'deploy', function() {
		shipit.archiveFile = project.name + '-' + project.version + '.zip';
		shipit.deployPath = shipit.config.deployRoot;

		return createDeploymentPath()
			.then( copyProject() )
			.then( unpackDeployment );
	});

	function createDeploymentPath() {
		return shipit.remote( 'mkdir -p ' + shipit.deployPath );
	}

	function copyProject() {
		return shipit.remoteCopy( 'dist/' + shipit.archiveFile, shipit.deployPath );
	}

	function unpackDeployment() {
		var cmd = [];

		cmd.push( 'cd ' + shipit.deployPath );
		cmd.push( 'rm -rf ' + project.name );
		cmd.push( 'unzip -q ' + shipit.archiveFile );
		cmd.push( 'rm ' + shipit.archiveFile );

		return shipit.remote( cmd.join( ' && ' ) );
	}
};
