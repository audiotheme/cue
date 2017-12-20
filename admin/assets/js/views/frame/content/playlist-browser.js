import wp from 'wp';

import { NoItems } from './browser/no-items';
import { Playlists } from './browser/playlists';
import { Sidebar } from './browser/sidebar';

export const PlaylistBrowser = wp.Backbone.View.extend({
	className: 'cue-playlist-browser',

	initialize: function( options ) {
		this.collection = options.controller.state().get( 'collection' );
		this.controller = options.controller;

		this._paged = 1;
		this._pending = false;

		this.scroll = this.scroll.bind( this );
		this.listenTo( this.collection, 'reset', this.render );

		if ( ! this.collection.length ) {
			this.getPlaylists();
		}
	},

	render: function() {
		this.$el.off( 'scroll' ).on( 'scroll', this.scroll );

		this.views.add([
			new Playlists({
				collection: this.collection,
				controller: this.controller
			}),
			new Sidebar({
				controller: this.controller
			}),
			new NoItems({
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
		wp.ajax.post( 'cue_get_playlists', {
			paged: this._paged
		}).done( response => {
			this.collection.add( response.playlists );

			this._paged++;

			if ( this._paged <= response.maxNumPages ) {
				this._pending = false;
				this.scroll();
			}
		});
	}
});
