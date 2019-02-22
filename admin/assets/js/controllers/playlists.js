import Backbone from 'backbone';
import wp from 'wp';

import { l10n } from 'cue';

export const PlaylistsController = wp.media.controller.State.extend({
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
		const collection = options.collection || new Backbone.Collection();
		const selection = options.selection || new Backbone.Collection();

		this.set( 'attributes', new Backbone.Model({
			id: null,
			show_playlist: true
		}) );

		this.set( 'collection', collection );
		this.set( 'selection', selection );
	}
});
