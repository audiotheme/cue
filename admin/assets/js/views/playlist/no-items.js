var PlaylistNoItems,
	wp = require( 'wp' );

PlaylistNoItems = wp.Backbone.View.extend({
	className: 'cue-playlist-browser-empty',
	tagName: 'div',
	template: wp.template( 'cue-playlist-browser-empty' ),

	initialize: function( options ) {
		this.collection = this.collection;

		this.listenTo( this.collection, 'add remove reset', this.toggleVisibility );
	},

	render: function() {
		this.$el.html( this.template() );
		return this;
	},

	toggleVisibility: function() {
		this.$el.toggleClass( 'is-visible', this.collection.length < 1 );
	}
});

module.exports = PlaylistNoItems;
