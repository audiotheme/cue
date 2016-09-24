var Playlist,
	Backbone = require( 'backbone' );

Playlist = Backbone.Model.extend({
	defaults: {
		thumbnail: '',
		title: ''
	}
});

module.exports = Playlist;
