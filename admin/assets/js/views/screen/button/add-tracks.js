import $ from 'jquery';
import wp from 'wp';

import workflows from '../../../modules/workflows';

export const AddTracksButton = wp.Backbone.View.extend({
	id: 'add-tracks',
	tagName: 'p',

	events: {
		'click .button': 'click'
	},

	initialize: function( options ) {
		this.l10n = options.l10n;
	},

	render: function() {
		const $button = $( '<a />', {
			text: this.l10n.addTracks
		}).addClass( 'button button-secondary' );

		this.$el.html( $button );

		return this;
	},

	click: function( e ) {
		e.preventDefault();
		workflows.get( 'addTracks' ).open();
	}
});
