/*global _cueSettings:false */

var $ = require( 'jquery' ),
	cue = require( 'cue' ),
	mejs = require( 'mediaelementjs' ),
	wp = require( 'wp' );

cue.data = _cueSettings; // Back-compat.
cue.settings( _cueSettings );

wp.media.view.settings.post.id = cue.data.postId;
wp.media.view.settings.defaultProps = {};

// Add mime-type aliases to MediaElement plugin support.
mejs.plugins.silverlight[0].types.push( 'audio/x-ms-wma' );

cue.model.Track = require( './models/track' );
cue.model.Tracks = require( './collections/tracks' );

cue.view.MediaFrame = require( './views/media-frame' );
cue.view.PostForm = require( './views/post-form' );
cue.view.AddTracksButton = require( './views/button/add-tracks' );
cue.view.TrackList = require( './views/track-list' );
cue.view.Track = require( './views/track' );
cue.view.TrackArtwork = require( './views/track/artwork' );
cue.view.TrackAudio = require( './views/track/audio' );

cue.workflows = require( './modules/workflows' );

/**
 * ========================================================================
 * SETUP
 * ========================================================================
 */

$(function( $ ) {
	var tracks;

	tracks = cue.tracks = new cue.model.Tracks( cue.data.tracks );
	delete cue.data.tracks;

	new cue.view.PostForm({
		collection: tracks,
		l10n: cue.l10n
	});
});
