/* global _cueSettings */

import $ from 'jquery';
import wp from 'wp';

import cue from 'cue';
import { EditPlaylistScreen } from './views/screen/edit-playlist';
import { Track } from './models/track';
import { Tracks } from './collections/tracks';
import workflows from './modules/workflows';

cue.data = _cueSettings; // Back-compat.
cue.config( _cueSettings );

wp.media.view.settings.post.id = cue.data.postId;
wp.media.view.settings.defaultProps = {};

Object.assign( cue, { collection: {}, controller: {}, model: {}, view: {} });
cue.model.Track = Track;
cue.model.Tracks = Tracks;
cue.workflows = workflows;

/**
 * ========================================================================
 * SETUP
 * ========================================================================
 */

$(function( $ ) {
	const tracks = new cue.model.Tracks( cue.data.tracks );
	cue.tracks = tracks;
	delete cue.data.tracks;

	const screen = new EditPlaylistScreen({
		el: '#post',
		collection: tracks,
		l10n: cue.l10n
	});

	screen.render();
});
