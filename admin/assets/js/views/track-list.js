var TrackList,
	$ = require( 'jquery' ),
	_ = require( 'underscore' ),
	Track = require( './track' ),
	wp = require( 'wp' );

TrackList = wp.Backbone.View.extend({
	className: 'cue-tracklist',
	tagName: 'ol',

	initialize: function() {
		this.listenTo( this.collection, 'add', this.addTrack );
		this.listenTo( this.collection, 'add remove', this.updateOrder );
		this.listenTo( this.collection, 'reset', this.render );
	},

	render: function() {
		this.$el.empty();

		this.collection.each( this.addTrack, this );
		this.updateOrder();

		this.$el.sortable( {
			axis: 'y',
			delay: 150,
			forceHelperSize: true,
			forcePlaceholderSize: true,
			opacity: 0.6,
			start: function( e, ui ) {
				ui.placeholder.css( 'visibility', 'visible' );
			},
			update: _.bind(function( e, ui ) {
				this.updateOrder();
			}, this )
		} );

		return this;
	},

	addTrack: function( track ) {
		var trackView = new Track({ model: track });
		this.$el.append( trackView.render().el );
	},

	updateOrder: function() {
		_.each( this.$el.find( '.cue-track' ), function( item, i ) {
			var cid = $( item ).data( 'cid' );
			this.collection.get( cid ).set( 'order', i );
		}, this );
	}
});

module.exports = TrackList;
