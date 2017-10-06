/* global jQuery, MediaElementPlayer */

(function( window, $, undefined )  {
	'use strict';

	var LOGO_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><path d="M10,40C4.5,40,0,35.5,0,30s4.5-10,10-10s10,4.5,10,10S15.5,40,10,40z M0,0l40,40V20L20,0H0z M80,0H40v14h40V0z M74,40L60,18L46,40H74z"/></svg>';

	$.extend( MediaElementPlayer.prototype, {
		buildaudiothememark: function( player, controls, layers, media ) {
			$( layers ).append( '<a href="https://audiotheme.com/?utm_source=wordpress-plugin&utm_medium=link&utm_content=cue-logo&utm_campaign=plugins" target="_blank" class="mejs-audiotheme-mark">' + LOGO_ICON + '</a>' );
		},

		buildcuebackground: function( player, controls, layers, media ) {
			var $background = $( player.container ).append( $( '<img />', {
				'class': 'mejs-player-background',
				src: player.options.cueBackgroundUrl
			})).find( '.mejs-player-background' );

			// Set each track to use the background image as artwork if it doesn't have artwork.
			$.each( player.options.cuePlaylistTracks, function( index, track ) {
				player.options.cuePlaylistTracks[ index ].thumb.src = track.thumb.src || player.options.cueBackgroundUrl;
			});

			$( player.node ).on( 'setTrack.cue', function( e, track, player ) {
				track.thumb = track.thumb || {};

				if ( '' === player.options.cueBackgroundUrl ) {
					$background.attr( 'src', track.thumb.src );
				}
			}).trigger( 'backgroundCreate.cue', player );
		}
	});

})( this, jQuery );
