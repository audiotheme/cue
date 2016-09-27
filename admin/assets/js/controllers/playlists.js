var Playlists,
	Backbone = require( 'backbone' ),
	l10n = require( 'cue' ).l10n,
	wp = require( 'wp' );

Playlists = wp.media.controller.State.extend({
	defaults: {
		id: 'cue-playlists',
		title: l10n.insertPlaylist || 'Insert Playlist',
		collection: null,
		content: 'cue-playlist-browser',
		menu: 'default',
		menuItem: {
			text: l10n.insertFromCue || 'Insert from Cue',
			priority: 130
		},
		selection: null,
		toolbar: 'cue-insert-playlist'
	},

	initialize: function( options ) {
		var collection = options.collection || new Backbone.Collection(),
			selection = options.selection || new Backbone.Collection();

		this.set( 'attributes', new Backbone.Model({
			id: null,
			show_playlist: true
		}) );

		this.set( 'collection', collection );
		this.set( 'selection', selection );

		this.listenTo( selection, 'remove', this.updateSelection );
	}
});

module.exports = Playlists;
