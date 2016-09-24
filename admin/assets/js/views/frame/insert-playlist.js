var InsertPlaylistFrame,
	PlaylistBrowser = require( '../content/playlist-browser' ),
	PlaylistsController = require( '../../controllers/playlists' ),
	PlaylistToolbar = require( '../toolbar/playlist' ),
	wp = require( 'wp' ),
	PostFrame = wp.media.view.MediaFrame.Post;

InsertPlaylistFrame = PostFrame.extend({
	createStates: function() {
		PostFrame.prototype.createStates.apply( this, arguments );

		this.states.add( new PlaylistsController({}) );
	},

	bindHandlers: function() {
		PostFrame.prototype.bindHandlers.apply( this, arguments );

		//this.on( 'menu:create:default', this.createCueMenu, this );
		this.on( 'content:create:cue-playlist-browser', this.createCueContent, this );
		this.on( 'toolbar:create:cue-insert-playlist', this.createCueToolbar, this );
	},

	createCueMenu: function( menu ) {
		menu.view.set({
			'cue-playlist-separator': new wp.media.View({
				className: 'separator',
				priority: 200
			})
		});
	},

	createCueContent: function( content ) {
		content.view = new PlaylistBrowser({
			controller: this
		});
	},

	createCueToolbar: function( toolbar ) {
		toolbar.view = new PlaylistToolbar({
			controller: this
		});
	},
});

module.exports = InsertPlaylistFrame;
