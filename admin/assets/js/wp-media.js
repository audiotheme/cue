/*global _cueMediaSettings:false, wp:false */

(function( wp ) {
	'use strict';

	var cue = require( 'cue' );

	cue.settings( _cueMediaSettings );

	wp.media.view.MediaFrame.Post = require( './views/frame/insert-playlist' );

})( wp );
