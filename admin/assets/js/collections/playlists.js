var Playlists,
	Backbone = require( 'backbone' ),
	Playlist = require( '../models/playlist' );

Playlists = Backbone.Collection.extend({
	model: Playlist
});

module.exports = Playlists;
