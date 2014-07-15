/*global _:false, _cueSettings:false, Backbone:false, cue:false, mejs:false, wp:false */

window.cue = window.cue || {};

(function( window, $, _, mejs, wp, undefined ) {
	'use strict';

	var l10n, workflows;

	cue.data = _cueSettings;
	l10n = cue.data.l10n;

	_.extend( cue, { controller: {}, model: {}, view: {} } );

	wp.media.view.settings.post.id = cue.data.settings.postId;
	wp.media.view.settings.defaultProps = {};

	// Add mime-type aliases to MediaElement plugin support.
	mejs.plugins.silverlight[0].types.push( 'audio/x-ms-wma' );

	/**
	 * ========================================================================
	 * SETUP
	 * ========================================================================
	 */

	jQuery(function( $ ) {
		var tracks;

		tracks = cue.tracks = new cue.model.Tracks( cue.data.tracks );
		delete cue.data.tracks;

		new cue.view.PostForm({
			collection: tracks
		});
	});

})( this, jQuery, _, mejs, wp );
