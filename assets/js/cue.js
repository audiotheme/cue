/*global _cueSettings:false, cue:false, SVGFEColorMatrixElement:false */

window.cue = window.cue || {};

(function( window, $, undefined )  {
	'use strict';

	var browserPrefixes = ' -webkit- -moz- -o- -ms- '.split( ' ' ),
		cssPrefixString = {},
		$html = $( 'html' ),
		cssPrefix;

	// Feature detection.
	cssPrefix = function( property ) {
		var e, i, prefixes;

		if ( cssPrefixString[ property ] || '' === cssPrefixString[ property ] ) {
			return cssPrefixString[ property ] + property;
		}

		e = document.createElement( 'div' );
		prefixes = ['', 'Moz', 'Webkit', 'O', 'ms', 'Khtml'];
		for ( i in prefixes ) {
			if ( 'undefined' !== typeof e.style[ prefixes[ i ] + property ] ) {
				cssPrefixString[ property ] = prefixes[ i ];
				return prefixes[ i ] + property;
			}
		}

		return property.toLowerCase();
	};

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/filters.js
	cue.settings.hasCssFilters = (function() {
		var el = document.createElement( 'div' );
		el.style.cssText = browserPrefixes.join( 'filter:blur(2px); ' );
		return !! el.style.length && ( ( undefined === document.documentMode || document.documentMode > 9 ) );
	}());

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg/filters.js
	cue.settings.hasSvgFilters = (function() {
		var result = false;
		try {
			result = 'SVGFEColorMatrixElement' in window && 2 === SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE;
		}
		catch( e ) {}
		return result;
	}());

	$html.toggleClass( 'no-css-filters', ! cue.settings.hasCssFilters ).toggleClass( 'no-svg-filters', ! cue.settings.hasSvgFilters );

	/**
	 * jQuery plugin to initialize playlists.
	 *
	 * @class cuePlaylist
	 * @memberOf jQuery.fn
	 *
	 * @param {Object} options Custom settings overrides.
	 *
	 * @return {jQuery} Chainable jQuery collection.
	 */
	$.fn.cuePlaylist = function( options ) {
		var settings = $.extend({
			autosizeProgress: false,
			cueBackgroundUrl: '',
			cuePlaylistTracks: [],
			cueResponsiveProgress: true,
			cueSkin: 'cue-skin-default',
			defaultAudioHeight: 0,
			enableAutosize: false,
			features: [
				'cuebackground',
				'cueartwork',
				'cueprevioustrack',
				'playpause',
				'cuenexttrack',
				'progress',
				'current',
				'duration',
				'cueplaylist',
				'audiothememark'
			],
			pluginPath: cue.settings.pluginPath,
			timeAndDurationSeparator: '<span class="mejs-time-separator"> / </span>'
		}, options );

		// Add selector settings.
		settings.cueSelectors = {
			playlist: this.selector,
			track: '.cue-track'
		};

		// Merge custom selector options into the defaults.
		if ( 'object' === typeof options && 'cueSelectors' in options ) {
			settings.cueSelectors = $.extend( settings.cueSelectors, options.cueSelectors );
		}

		return this.each(function() {
			var $playlist = $( this ),
				$media = $playlist.find( '.cue-audio' ),
				$data = $playlist.closest( '.cue-playlist-container' ).find( '.cue-playlist-data' ),
				data;

			if ( $data.length ) {
				data = $.parseJSON( $data.first().html() );

				// Set the background image source.
				if ( ( 'undefined' === typeof options || 'undefined' === typeof options.cueBackgroundUrl ) && 'thumbnail' in data ) {
					settings.cueBackgroundUrl = data.thumbnail;
				}

				// Add the tracks.
				if ( ( 'undefined' === typeof options || 'undefined' === typeof options.cuePlaylistTracks ) && 'tracks' in data ) {
					settings.cuePlaylistTracks = data.tracks;
				}
			}

			// Blur the background image when it's created.
			$media.on( 'backgroundCreate.cue', function( e, player ) {
				player.container.find( '.mejs-player-background' ).Vague({ intensity: 10 }).blur();
			});

			if ( settings.cuePlaylistTracks.length ) {
				// Initialize MediaElement.js.
				$media.mediaelementplayer( settings );
			}
		});
	};

	// Document ready.
	$(function( $ ) {
		// Initialize the playlists.
		$( '.cue-playlist' ).cuePlaylist().cueMediaClasses({
			breakpoints: [{
				type: 'max-width',
				size: 380
			},
			{
				type: 'max-width',
				size: 300
			},
			{
				type: 'max-width',
				size: 200
			}]
		});
	});

})( this, jQuery );
