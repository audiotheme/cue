var EditPlaylistFrame,
	_ = require( 'underscore' ),
	PlaylistBrowser = require( '../content/playlist-browser' ),
	PlaylistsController = require( '../../controllers/playlists' ),
	PlaylistToolbar = require( '../toolbar/playlist' ),
	wp = require( 'wp' ),
	MediaFrame = wp.media.view.MediaFrame;

EditPlaylistFrame = MediaFrame.extend({
	initialize: function() {
		_.extend( this.options, {
			uploader: false
		});

		MediaFrame.prototype.initialize.apply( this, arguments );

		this.createStates();
		this.bindHandlers();

		this.setState( 'cue-edit-playlist' );
	},

	createStates: function() {
		this.states.add( new PlaylistsController({
			id: 'cue-edit-playlist',
			content: 'cue-edit-playlist',
			menuItem: false,
			title: 'Edit Playlist',
			toolbar: 'cue-edit-playlist'
		}) );
	},

	bindHandlers: function() {
		this.on( 'content:create:cue-edit-playlist', this.createCueContent, this );
		this.on( 'toolbar:create:cue-edit-playlist', this.createCueToolbar, this );
	},

	createCueContent: function( region ) {
		region.view = new PlaylistBrowser({
			controller: this
		});
	},

	createCueToolbar: function( region, options ) {
		region.view = new PlaylistToolbar({
			controller: this
		});
	}
});

module.exports = EditPlaylistFrame;
