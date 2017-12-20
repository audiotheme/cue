import _ from 'underscore';
import wp from 'wp';

import workflows from '../../../modules/workflows';

export const TrackArtwork = wp.Backbone.View.extend({
	tagName: 'span',
	className: 'cue-track-artwork',
	template: wp.template( 'cue-playlist-track-artwork' ),

	events: {
		'click': 'select'
	},

	initialize: function( options ) {
		this.parent = options.parent;
		this.listenTo( this.model, 'change:artworkUrl', this.render );
	},

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ) );
		this.parent.$el.toggleClass( 'has-artwork', ! _.isEmpty( this.model.get( 'artworkUrl' ) ) );
		return this;
	},

	select: function() {
		workflows.setModel( this.model ).get( 'selectArtwork' ).open();
	}
});
