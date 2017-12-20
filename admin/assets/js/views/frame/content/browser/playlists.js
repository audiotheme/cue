import wp from 'wp';

import { Playlist } from './playlist';

export const Playlists = wp.Backbone.View.extend({
	className: 'cue-playlist-browser-list',
	tagName: 'ul',

	initialize: function( options ) {
		this.collection = options.controller.state().get( 'collection' );
		this.controller = options.controller;

		this.listenTo( this.collection, 'add', this.addItem );
		this.listenTo( this.collection, 'reset', this.render );
	},

	render: function() {
		this.collection.each( this.addItem, this );
		return this;
	},

	addItem: function( model ) {
		const view = new Playlist({
			controller: this.controller,
			model: model
		}).render();

		this.$el.append( view.el );
	}
});
