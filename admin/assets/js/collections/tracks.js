var Tracks,
	_ = require( 'underscore' ),
	Backbone = require( 'backbone' ),
	settings = require( 'cue' ).settings(),
	Track = require( '../models/track' ),
	wp = require( 'wp' );

Tracks = Backbone.Collection.extend({
	model: Track,

	comparator: function( track ) {
		return parseInt( track.get( 'order' ), 10 );
	},

	fetch: function() {
		var collection = this;

		return wp.ajax.post( 'cue_get_playlist_tracks', {
			post_id: settings.postId
		}).done(function( tracks ) {
			collection.reset( tracks );
		});
	},

	save: function( data ) {
		this.sort();

		data = _.extend({}, data, {
			post_id: settings.postId,
			tracks: this.toJSON(),
			nonce: settings.saveNonce
		});

		return wp.ajax.post( 'cue_save_playlist_tracks', data );
	}
});

module.exports = Tracks;
