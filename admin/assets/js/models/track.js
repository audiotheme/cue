var Track,
	Backbone = require( 'backbone' );

Track = Backbone.Model.extend({
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

module.exports = Track;
