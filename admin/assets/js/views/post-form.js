var PostForm,
	$ = require( 'jquery' ),
	AddTracksButton = require( './button/add-tracks' ),
	TrackList = require( './track-list' ),
	wp = require( 'wp' );

PostForm = wp.Backbone.View.extend({
	el: '#post',
	saved: false,

	events: {
		'click #publish': 'buttonClick',
		'click #save-post': 'buttonClick'
		//'submit': 'submit'
	},

	initialize: function( options ) {
		this.l10n = options.l10n;

		this.render();
	},

	render: function() {
		this.views.add( '#cue-playlist-editor .cue-panel-body', [
			new AddTracksButton({
				collection: this.collection,
				l10n: this.l10n
			}),

			new TrackList({
				collection: this.collection
			})
		]);

		return this;
	},

	buttonClick: function( e ) {
		var self = this,
			$button = $( e.target );

		if ( ! self.saved ) {
			this.collection.save().done(function( data ) {
				self.saved = true;
				$button.click();
			});
		}

		return self.saved;
	}
});

module.exports = PostForm;
