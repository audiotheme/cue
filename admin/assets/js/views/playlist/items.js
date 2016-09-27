var PlaylistItems,
	PlaylistItem = require( '../playlist/item' ),
	wp = require( 'wp' );

PlaylistItems = wp.Backbone.View.extend({
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
		var view = new PlaylistItem({
			controller: this.controller,
			model: model
		}).render();

		this.$el.append( view.el );
	}
});

module.exports = PlaylistItems;
