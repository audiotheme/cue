/*global _:false, Backbone:false, cue:false, wp:false */

window.cue = window.cue || {};

(function( window, $, _, Backbone, wp, undefined ) {
	'use strict';


	/**
	 * ========================================================================
	 * MODELS
	 * ========================================================================
	 */

	cue.model.Track = Backbone.Model.extend({
		defaults: {
			artist: '',
			artworkId: '',
			artworkUrl: '',
			audioId: '',
			audioUrl: '',
			format: '',
			length: '',
			title: '',
			order: 0
		}
	});

	cue.model.Tracks = Backbone.Collection.extend({
		model: cue.model.Track,

		comparator: function( track ) {
			return parseInt( track.get( 'order' ), 10 );
		},

		fetch: function() {
			var collection = this;

			return wp.ajax.post( 'cue_get_playlist', {
				post_id: cue.data.settings.postId
			}).done(function( tracks ) {
				collection.reset( tracks );
			});
		},

		save: function( data ) {
			this.sort();

			data = _.extend({}, data, {
				post_id: cue.data.settings.postId,
				tracks: this.toJSON(),
				nonce: cue.data.settings.saveNonce
			});

			return wp.ajax.post( 'cue_save_playlist_tracks', data );
		}
	});

})( this, jQuery, _, Backbone, wp );
