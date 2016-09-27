var Playlist,
	wp = require( 'wp' );

Playlist = wp.Backbone.View.extend({
	tagName: 'li',
	className: 'cue-playlist-browser-list-item',
	template: wp.template( 'cue-playlist-browser-list-item' ),

	events: {
		'click': 'resetSelection'
	},

	initialize: function( options ) {
		this.controller = options.controller;
		this.model = options.model;
		this.selection = this.controller.state().get( 'selection' );

		this.listenTo( this.selection, 'add remove reset', this.updateSelectedClass );
	},

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	},

	resetSelection: function( e ) {
		if ( this.selection.contains( this.model ) ) {
			this.selection.remove( this.model );
		} else {
			this.selection.reset( this.model );
		}
	},

	updateSelectedClass: function() {
		if ( this.selection.contains( this.model ) ) {
			this.$el.addClass( 'is-selected' );
		} else {
			this.$el.removeClass( 'is-selected' );
		}
	}
});

module.exports = Playlist;
