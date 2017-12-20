import Backbone from 'backbone';
import wp from 'wp';

import { settings } from 'cue';
import { Track } from '../models/track';

export const Tracks = Backbone.Collection.extend({
	model: Track,

	comparator: function( track ) {
		return parseInt( track.get( 'order' ), 10 );
	},

	fetch: function() {
		return wp.ajax.post( 'cue_get_playlist_tracks', {
			post_id: settings.postId
		}).done( tracks => this.reset( tracks ) );
	},

	save: function( data ) {
		this.sort();

		data = Object.assign({}, data, {
			post_id: settings.postId,
			tracks: this.toJSON(),
			nonce: settings.saveNonce
		});

		return wp.ajax.post( 'cue_save_playlist_tracks', data );
	}
});
