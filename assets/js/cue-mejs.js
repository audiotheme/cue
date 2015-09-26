/*global MediaElementPlayer:false */

(function( window, $, undefined )  {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildaudiothememark: function( player, controls, layers, media ) {
			layers.append( '<a href="https://audiotheme.com/" target="_blank" class="mejs-audiotheme-mark">AudioTheme</a>' );
		},

		buildcuebackground: function( player, controls, layers, media ) {
			var $background = player.container.append( $( '<img />', {
				'class': 'mejs-player-background',
				src: player.options.cueBackgroundUrl
			})).find( '.mejs-player-background' );

			// Set each track to use the background image as artwork if it doesn't have artwork.
			$.each( player.options.cuePlaylistTracks, function( index, track ) {
				player.options.cuePlaylistTracks[ index ].thumb.src = track.thumb.src || player.options.cueBackgroundUrl;
			});

			player.$node.on( 'setTrack.cue', function( e, track, player ) {
				track.thumb = track.thumb || {};

				if ( '' === player.options.cueBackgroundUrl ) {
					$background.attr( 'src', track.thumb.src );
				}
			}).trigger( 'backgroundCreate.cue', player );
		}
	});

})( this, jQuery );
