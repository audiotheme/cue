/*global _cueSettings:false, cue:false, SVGFEColorMatrixElement:false */

window.cue = window.cue || {};

(function( window, $, undefined )  {
	'use strict';

	var browserPrefixes = ' -webkit- -moz- -o- -ms- '.split( ' ' ),
		cssPrefixString = {},
		$html = $( 'html' ),
		cssPrefix;

	cue.l10n = $.extend( cue.l10n, _cueSettings.l10n );

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
		} catch( e ) {}
		// IE doesn't support SVG filters on HTML elements.
		return result && ! /(MSIE|Trident)/.test( window.navigator.userAgent );
	}());

	$html.toggleClass( 'no-css-filters', ! cue.settings.hasCssFilters ).toggleClass( 'no-svg-filters', ! cue.settings.hasSvgFilters );

	// Document ready.
	$( document ).ready(function( $ ) {
		// Initialize the playlists.
		$( '.cue-playlist' ).each(function() {
			var $playlist = $( this ),
				$data = $playlist.closest( '.cue-playlist-container' ).find( '.cue-playlist-data' ),
				backgroundUrl = '',
				data;

			if ( $data.length ) {
				data = $.parseJSON( $data.first().html() );

				// Set the background image source.
				if ( 'thumbnail' in data ) {
					backgroundUrl = data.thumbnail;
				}
			}

			if ( ! cue.settings.hasCssFilters && cue.settings.hasSvgFilters ) {
				if ( ! $( '#cue-filter-blur' ).length ) {
					$( 'body' ).append( '<svg id="cue-filter-svg" style="position: absolute; bottom: 0"><filter id="cue-filter-blur"><feGaussianBlur class="blur" stdDeviation="20" color-interpolation-filters="sRGB"/></filter></svg>' );
				}

				$playlist.on( 'backgroundCreate.cue', function( e, player ) {
					player.container.find( '.mejs-player-background' ).css( 'filter', 'url(\'' + window.location.href + '#cue-filter-blur\')' );
				});
			}

			$playlist.cuePlaylist({
				cueBackgroundUrl: backgroundUrl,
				cueResponsiveProgress: true,
				cueSelectors: {
					playlist: '.cue-playlist'
				},
				cueSkin: 'cue-skin-default',
				defaultAudioHeight: 0,
				features: [
					'cuebackground',
					'cueartwork',
					'cuecurrentdetails',
					'cueprevioustrack',
					'playpause',
					'cuenexttrack',
					'volume',
					'progress',
					'current',
					'duration',
					'cueplaylist',
					'audiothememark'
				]
			}).cueMediaClasses({
				breakpoints: [{
					type: 'max-width',
					size: 480
				}, {
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
	});

})( this, jQuery );
