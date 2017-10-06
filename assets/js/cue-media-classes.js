/* global jQuery */

(function( window, $, undefined ) {
	'use strict';

	var $elems = $([]),
		doCallback = true,
		mediaClasses;

	mediaClasses = {
		init: function() {
			$( window ).on( 'resize.cue', mediaClasses.resize );
		},

		/**
		 * Convert element breakpoints to the correct format when initialized to
		 * keep the resize method lightweight.
		 *
		 * @param {Object} el A DOM element.
		 */
		initEl: function( el ) {
			var $el = $( el ),
				settings = $el.data( 'cueMediaClasses' ),
				breakpoints = [],
				bp, i, type, width;

			if ( ! settings.breakpoints.length ) {
				return;
			}

			for ( i = 0; i < settings.breakpoints.length; i ++ ) {
				bp = settings.breakpoints[ i ];
				type = bp.type || 'min-width';
				width = bp.size || bp;

				breakpoints[ i ] = {
					type: type,
					size: width,
					className: bp.className || type + '-' + width
				};
			}

			settings.breakpoints = breakpoints;
			$el.data( 'cueMediaSettings', settings );
			mediaClasses.update( $el );
		},

		/**
		 * Debounced callback to update media classes when the viewport is resized.
		 */
		resize: function() {
			if ( doCallback && $elems.length ) {
				doCallback = false;

				setTimeout(function() {
					mediaClasses.update( $elems );
					doCallback = true;
				}, $.fn.cueMediaClasses.defaults.resizeDelay );
			}
		},

		/**
		 * Update media classes.
		 *
		 * @param {Object} $items A collection of jQuery objects.
		 */
		update: function( $items ) {
			$items.each(function() {
				var $el = $( this ),
					w = $el.outerWidth(),
					settings = $el.data( 'cueMediaClasses' ),
					bp, i;

				if ( ! settings.breakpoints.length ) {
					return;
				}

				if ( 'number' !== typeof w ) {
					w = $el.width();
				}

				for ( i = 0; i < settings.breakpoints.length; i ++ ) {
					bp = settings.breakpoints[ i ];
					$el.toggleClass( bp.className, 'min-width' === bp.type ? w >= bp.size : w <= bp.size );
				}
			});
		}
	};

	// Initialize.
	mediaClasses.init();

	/**
	 * jQuery plugin to add element queries.
	 *
	 * @class cueMediaClasses
	 * @memberOf jQuery.fn
	 *
	 * @param {Object} options Custom settings overrides.
	 *
	 * @return {jQuery} Chainable jQuery collection.
	 */
	$.fn.cueMediaClasses = function( options ) {
		var settings = $.extend({
			breakpoints: []
		}, options );

		return this.each(function() {
			var $this = $( this );

			$this.data( 'cueMediaClasses', settings );

			$elems = $elems.add( $this );
			mediaClasses.initEl( $this );
		});
	};

	$.fn.cueMediaClasses.defaults = {
		resizeDelay: 800
	};
})( this, jQuery );
