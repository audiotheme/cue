/*global _cueSettings:false, cue:false, MediaElementPlayer:false, mejs:false */

window.cue = window.cue || {};

(function( window, $, undefined )  {
	'use strict';

	var $window = $( window );

	cue.settings = _cueSettings;
	cue.l10n = _cueSettings.l10n;
	delete cue.settings.l10n;

	// Add mime-type aliases to MediaElement plugin support.
	mejs.plugins.silverlight[0].types.push( 'audio/x-ms-wma' );

	/**
	 * Add additional options to MediaElement.js.
	 */
	$.extend( mejs.MepDefaults, {
		cueBackgroundUrl: '',
		cuePlaylistTracks: [],
		cueResponsiveProgress: false, // Set the progress bar to 100% on window resize.
		cueSelectors: {
			playlist: '.cue-playlist',
			track: '.cue-track'
		},
		cueSkin: '',
		success: function( media, domObject, player ) {
			var $media = $( media ),
				$container = player.container.closest( player.options.cueSelectors.playlist );

			if ( '' !== player.options.cueSkin ) {
				player.changeSkin( player.options.cueSkin );
			}

			// Make the time rail responsive.
			if ( player.options.cueResponsiveProgress ) {
				$window.on( 'resize', function() {
					player.controls.find( '.mejs-time-rail' ).width( '100%' );
					//t.setControlsSize();
				}).trigger( 'resize' );
			}

			$media.on( 'play', function( media ) {
				$container.addClass( 'is-playing' );
			}).on( 'pause', function() {
				$container.removeClass( 'is-playing' );
			});

			$media.trigger( 'success.cue', media, domObject, player );
		}
	});

	/**
	 * Add additional controls and methods to MediaElement.js.
	 */
	$.extend( MediaElementPlayer.prototype, {
		cueCurrentTrack: 0,

		buildcueartwork: function( player, controls, layers, media ) {
			layers.append( '<span class="mejs-track-artwork"><img src=""></span>' );
			layers.append( '<div class="mejs-track-details"><span class="mejs-track-artist"></span><span class="mejs-track-title"></span></div>' );
		},

		buildaudiothememark: function( player, controls, layers, media ) {
			layers.append( '<a href="http://audiotheme.com/" target="_blank" class="mejs-audiotheme-mark">AudioTheme</a>' );
		},

		buildcuebackground: function( player, controls, layers, media ) {
			player.container.append( $( '<img />', {
				'class': 'mejs-player-background',
				src: player.options.cueBackgroundUrl
			}));
			player.$node.trigger( 'backgroundCreate.cue', player );
		},

		buildcuenexttrack: function( player, controls, layers, media ) {
			$( '<div class="mejs-button mejs-next-button mejs-next">' +
					'<button type="button" aria-controls="' + player.id + '" title="' + cue.l10n.nextTrack + '"></button>' +
					'</div>' )
				.appendTo( controls )
				.on( 'click', function( e ){
					player.cuePlayNextTrack();
				});
		},

		buildcueplaylist: function( player, controls, layers, media ) {
			var selectors = player.options.cueSelectors;

			player.cueSetCurrentTrack( player.options.cuePlaylistTracks[0], false );

			// Play a track when it's clicked in the track list.
			player.container.closest( selectors.playlist ).on( 'click', selectors.track, function() {
				var $track = $( this ),
					index = $track.closest( selectors.playlist ).find( selectors.track ).index( $track );

				player.cueSetCurrentTrack( index );
			});

			// Play the next track when one ends.
			$( media ).on( 'ended', function( e ) {
				player.$node.trigger( 'nextTrack.cue', player );
				player.cuePlayNextTrack();
			});
		},

		buildcueplaylisttoggle: function( player, controls, layers, media ) {
			var selectors = player.options.cueSelectors;

			$( '<div class="mejs-button mejs-toggle-playlist-button mejs-toggle-playlist">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + cue.l10n.togglePlaylist + '"></button>' +
				'</div>' )
			.appendTo( player.controls )
			.on( 'click', function() {
				$( this ).closest( selectors.playlist ).find( '.cue-tracks' ).slideToggle( 200 );
			});
		},

		buildcueprevioustrack: function( player, controls, layers, media ) {
			$( '<div class="mejs-button mejs-previous-button mejs-previous">' +
					'<button type="button" aria-controls="' + player.id + '" title="' + cue.l10n.previousTrack + '"></button>' +
					'</div>' )
				.appendTo( controls )
				.on( 'click', function( e ){
					player.cuePlayPreviousTrack();
				});
		},

		cuePlayNextTrack: function() {
			var player = this,
				index = player.cueCurrentTrack + 1 >= player.options.cuePlaylistTracks.length ? 0 : player.cueCurrentTrack + 1;

			player.$node.trigger( 'nextTrack.cue', player );
			player.cueSetCurrentTrack( index );
		},

		cuePlayPreviousTrack: function() {
			var player = this,
				index = player.cueCurrentTrack - 1 < 0 ? player.options.cuePlaylistTracks.length - 1 : player.cueCurrentTrack - 1;

			player.$node.trigger( 'previousTrack.cue', player );
			player.cueSetCurrentTrack( index );
		},

		cueSetCurrentTrack: function( track, play ) {
			var player = this,
				selectors = player.options.cueSelectors,
				$artwork = player.layers.find( '.mejs-track-artwork' ),
				artworkUrl;

			if ( 'number' === typeof track ) {
				player.cueCurrentTrack = track;
				track = player.options.cuePlaylistTracks[ player.cueCurrentTrack ];
			}

			player.container.closest( selectors.playlist )
				.find( selectors.track ).removeClass( 'is-current' )
				.eq( player.cueCurrentTrack ).addClass( 'is-current' );

			player.layers.find( '.mejs-track-artist' ).html( track.artist );
			player.layers.find( '.mejs-track-title' ).html( track.title );

			// Set the artwork src and toggle depending on if the URL is empty.
			artworkUrl = track.artworkUrl || player.options.cueBackgroundUrl;
			$artwork.find( 'img' ).attr( 'src', artworkUrl ).toggle( '' !== artworkUrl );

			// Set the background image to be the same as the artwork if one hasn't been defined.
			if ( '' === player.options.cueBackgroundUrl ) {
				player.container.find( '.mejs-player-background' ).attr( 'src', track.artworkUrl );
			}

			if ( track.length ) {
				player.controls.find( '.mejs-duration' ).text( track.length );
			}

			player.pause();
			player.setSrc( track.audioUrl );
			player.load();

			player.$node.trigger( 'setTrack.cue', track, player );

			if ( play || 'undefined' === typeof play ) {
				// Browsers don't seem to play without the timeout.
				setTimeout(function() {
					player.play();
				}, 100 );
			}
		}
	});

})( this, jQuery );
