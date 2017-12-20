import wp from 'wp';

import SelectPlaylistToolbar from './toolbar/select-playlist';

const l10n = require( 'cue' ).l10n;
const PlaylistBrowser = require( '../../../../views/content/playlist-browser' );
const PlaylistsController = require( '../../../../controllers/playlists' );

export default wp.media.view.MediaFrame.Select.extend({
	className: 'media-frame cue-playlists-frame cue-playlists-frame--select',

	createStates: function() {
		this.states.add( new PlaylistsController({
			title: l10n.selectPlaylist || 'Select Playlist',
		}) );
	},

	bindHandlers: function() {
		wp.media.view.MediaFrame.Select.prototype.bindHandlers.apply( this, arguments );

		this.on( 'content:create:cue-playlist-browser', this.createCueContent, this );
		this.on( 'toolbar:create:cue-insert-playlist', this.createCueToolbar, this );
	},

	createCueContent: function( content ) {
		content.view = new PlaylistBrowser({
			controller: this
		});
	},

	createCueToolbar: function( toolbar ) {
		toolbar.view = new SelectPlaylistToolbar({
			controller: this
		});
	}
});
