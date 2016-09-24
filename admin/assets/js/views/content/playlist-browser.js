var PlaylistBrowser,
	_ = require( 'underscore' ),
	PlaylistItem = require( '../playlist/item' ),
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
		this.listenTo( this.collection, 'add', this.addItem );
		this.listenTo( this.collection, 'reset', this.render );
	},

	render: function() {
		if ( ! this.collection.length ) {
			this.getPlaylists();
		}

		this.$el.off( 'scroll' ).on( 'scroll', this.scroll );

		this.$el.html( '<ul class="cue-playlist-browser-list" />' );

		this.views.add(
			new PlaylistSidebar({
				controller: this.controller
			})
		);

		this.collection.each( this.addItem, this );

		return this;
	},

	addItem: function( model ) {
		var view = new PlaylistItem({
			controller: this.controller,
			model: model
		}).render();

		this.$el.children( 'ul' ).append( view.el );
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
