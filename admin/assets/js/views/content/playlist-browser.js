var PlaylistBrowser,
	_ = require( 'underscore' ),
	PlaylistItems = require( '../playlist/items' ),
	PlaylistNoItems = require( '../playlist/no-items' ),
	PlaylistSidebar = require( '../playlist/sidebar' ),
	wp = require( 'wp' );

PlaylistBrowser = wp.Backbone.View.extend({
	className: 'cue-playlist-browser',

	initialize: function( options ) {
		this.collection = options.controller.state().get( 'collection' );
		this.controller = options.controller;

		this._paged = 1;
		this._pending = false;

		_.bindAll( this, 'scroll' );
		this.listenTo( this.collection, 'reset', this.render );

		if ( ! this.collection.length ) {
			this.getPlaylists();
		}
	},

	render: function() {
		this.$el.off( 'scroll' ).on( 'scroll', this.scroll );

		this.views.add([
			new PlaylistItems({
				collection: this.collection,
				controller: this.controller
			}),
			new PlaylistSidebar({
				controller: this.controller
			}),
			new PlaylistNoItems({
				collection: this.collection
			})
		]);

		return this;
	},

	scroll: function() {
		if ( ! this._pending && this.el.scrollHeight < this.el.scrollTop + this.el.clientHeight * 3 ) {
			this._pending = true;
			this.getPlaylists();
		}
	},

	getPlaylists: function() {
		var view = this;

		wp.ajax.post( 'cue_get_playlists', {
			paged: view._paged
		}).done(function( response ) {
			view.collection.add( response.playlists );

			view._paged++;

			if ( view._paged <= response.maxNumPages ) {
				view._pending = false;
				view.scroll();
			}
		});
	}
});

module.exports = PlaylistBrowser;
