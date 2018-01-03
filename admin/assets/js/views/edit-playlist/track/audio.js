import $ from 'jquery';
import mejs from 'mediaelementjs';
import wp from 'wp';

import { settings } from 'cue';
import workflows from '../../../modules/workflows';

export const TrackAudio = wp.Backbone.View.extend({
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
		const track = this.model.toJSON();
		const playerId = this.$el.find( '.mejs-audio' ).attr( 'id' );

		// Remove the MediaElement player object if the
		// audio file URL is empty.
		if ( '' === track.audioUrl && playerId ) {
			mejs.players[ playerId ].remove();
		}

		// Render the media element.
		this.$el.html( this.template( this.model.toJSON() ) );

		// Set up MediaElement.js.
		const $mediaEl = this.$el.find( '.cue-audio' );

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

			const playerSettings = {
				classPrefix: 'mejs-',
				defaultAudioHeight: 30,
				features: [ 'playpause', 'current', 'progress', 'duration' ],
				pluginPath: settings.pluginPath,
				stretching: 'responsive',
				success: ( mediaElement, domObject, t ) => {
					const $fakeBody = $( t.container ).parent();

					// Remove the fake <body> tag.
					if ( $.nodeName( $fakeBody.get( 0 ), 'body' ) ) {
						$fakeBody.replaceWith( $fakeBody.get( 0 ).childNodes );
					}
				},
				error: el => {
					const $el = $( el );
					const $parent = $el.closest( '.cue-track' );
					const playerId = $el.closest( '.mejs-audio' ).attr( 'id' );

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
		const track = this.model.toJSON();
		const playerId = this.$el.find( '.mejs-audio' ).attr( 'id' );
		const player = playerId ? mejs.players[ playerId ] : null;

		if ( player && '' !== track.audioUrl ) {
			player.pause();
			player.setSrc( track.audioUrl );
		} else {
			this.render();
		}
	},

	cleanup: function() {
		const playerId = this.$el.find( '.mejs-audio' ).attr( 'id' );
		const player = playerId ? mejs.players[ playerId ] : null;

		if ( player ) {
			player.remove();
		}
	},

	select: function() {
		workflows.setModel( this.model ).get( 'selectAudio' ).open();
	}
});
