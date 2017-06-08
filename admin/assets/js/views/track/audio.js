var TrackAudio,
	$ = require( 'jquery' ),
	_ = require( 'underscore' ),
	mejs = require( 'mediaelementjs' ),
	settings = require( 'cue' ).settings(),
	workflows = require( '../../modules/workflows' ),
	wp = require( 'wp' );

TrackAudio = wp.Backbone.View.extend({
	tagName: 'span',
	className: 'cue-track-audio',
	template: wp.template( 'cue-playlist-track-audio' ),

	events: {
		'click .cue-track-audio-selector': 'select'
	},

	initialize: function( options ) {
		this.parent = options.parent;

		this.listenTo( this.model, 'change:audioUrl', this.refresh );
		this.listenTo( this.model, 'destroy', this.cleanup );
	},

	render: function() {
		var $mediaEl, playerSettings,
			track = this.model.toJSON(),
			playerId = this.$el.find( '.mejs-audio' ).attr( 'id' );

		// Remove the MediaElement player object if the
		// audio file URL is empty.
		if ( '' === track.audioUrl && playerId ) {
			mejs.players[ playerId ].remove();
		}

		// Render the media element.
		this.$el.html( this.template( this.model.toJSON() ) );

		// Set up MediaElement.js.
		$mediaEl = this.$el.find( '.cue-audio' );

		if ( $mediaEl.length ) {
			// MediaElement traverses the DOM and throws an error if it
			// can't find a parent node before reaching <body>. It makes
			// sure the flash fallback won't exist within a <p> tag.

			// The view isn't attached to the DOM at this point, so an
			// error is thrown when reaching the top of the tree.

			// This hack makes it stop searching. The fake <body> tag is
			// removed in the success callback.
			// @see mediaelement-and-player.js:~1222
			$mediaEl.wrap( '<body></body>' );

			playerSettings = {
				//enablePluginDebug: true,
				classPrefix: 'mejs-',
				defaultAudioHeight: 30,
				features: [ 'playpause', 'current', 'progress', 'duration' ],
				pluginPath: settings.pluginPath,
				stretching: 'responsive',
				success: _.bind( function( mediaElement, domObject, t ) {
					var $fakeBody = $( t.container ).parent();

					// Remove the fake <body> tag.
					if ( $.nodeName( $fakeBody.get( 0 ), 'body' ) ) {
						$fakeBody.replaceWith( $fakeBody.get( 0 ).childNodes );
					}
				}, this ),
				error: function( el ) {
					var $el = $( el ),
						$parent = $el.closest( '.cue-track' ),
						playerId = $el.closest( '.mejs-audio' ).attr( 'id' );

					// Remove the audio element if there is an error.
					mejs.players[ playerId ].remove();
					$parent.find( 'audio' ).remove();
				}
			};

			// Hack to allow .m4a files.
			// @link https://github.com/johndyer/mediaelement/issues/291
			if ( 'm4a' === $mediaEl.attr( 'src' ).split( '.' ).pop() ) {
				playerSettings.pluginVars = 'isvideo=true';
			}

			$mediaEl.mediaelementplayer( playerSettings );
		}

		return this;
	},

	refresh: function( e ) {
		var track = this.model.toJSON(),
			playerId = this.$el.find( '.mejs-audio' ).attr( 'id' ),
			player = playerId ? mejs.players[ playerId ] : null;

		if ( player && '' !== track.audioUrl ) {
			player.pause();
			player.setSrc( track.audioUrl );
		} else {
			this.render();
		}
	},

	cleanup: function() {
		var playerId = this.$el.find( '.mejs-audio' ).attr( 'id' ),
			player = playerId ? mejs.players[ playerId ] : null;

		if ( player ) {
			player.remove();
		}
	},

	select: function() {
		workflows.setModel( this.model ).get( 'selectAudio' ).open();
	}
});

module.exports = TrackAudio;
