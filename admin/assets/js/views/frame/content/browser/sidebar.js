import $ from 'jquery';
import wp from 'wp';

export const Sidebar = wp.Backbone.View.extend({
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
		const $target = $( e.target );
		const attribute = $target.data( 'setting' );
		let value = e.target.value;

		if ( 'checkbox' === e.target.type ) {
			value = !! $target.prop( 'checked' );
		}

		this.attributes.set( attribute, value );
	}
});
