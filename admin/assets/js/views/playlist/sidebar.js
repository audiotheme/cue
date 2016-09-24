var PlaylistSidebar,
	$ = require( 'jquery' ),
	wp = require( 'wp' );

PlaylistSidebar = wp.Backbone.View.extend({
	className: 'cue-playlist-browser-sidebar media-sidebar',
	template: wp.template( 'cue-playlist-browser-sidebar' ),

	events: {
		'change [data-setting]': 'updateAttribute'
	},

	initialize: function( options ) {
		this.attributes = options.controller.state().get( 'attributes' );
	},

	render: function() {
		this.$el.html( this.template() );
	},

	updateAttribute: function( e ) {
		var $target = $( e.target ),
			attribute = $target.data( 'setting' ),
			value = e.target.value;

		if ( 'checkbox' === e.target.type ) {
			value = !! $target.prop( 'checked' );
		}

		this.attributes.set( attribute, value );
	}
});

module.exports = PlaylistSidebar;
