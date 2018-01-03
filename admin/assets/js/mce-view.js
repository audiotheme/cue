/*global _, _cueMceView, jQuery, wp */

(function( $, wp ) {
	'use strict';

	const settings = _cueMceView;

	let extend = {
		action: 'cue_parse_shortcode',
		state: [ 'cue-playlists' ],

		initialize: function() {
			let self = this;

			if ( this.url ) {
				this.loader = false;
				this.shortcode = wp.media.embed.shortcode( {
					url: this.text
				} );
			}

			wp.ajax.post( this.action, {
				_ajax_nonce: settings.parseNonce,
				shortcode: this.shortcode.string()
			} )
			.done( function( response ) {
				self.render( response );
			} )
			.fail( function( response ) {
				if ( self.url ) {
					self.removeMarkers();
				} else {
					self.setError( response.message || response.statusText, 'admin-media' );
				}
			} );

			this.getEditors( function( editor ) {
				editor.on( 'wpview-selected', function() {
					self.pausePlayers();
				} );
			} );
		},

		pausePlayers: function() {
			this.getNodes( function( editor, node, content ) {
				let win = $( 'iframe.wpview-sandbox', content ).get( 0 );

				if ( win && ( win = win.contentWindow ) && win.mejs ) {
					_.each( win.mejs.players, function( player ) {
						try {
							player.pause();
						} catch ( e ) {}
					} );
				}
			} );
		}
	};

	// Support for versions before WP 4.2
	if ( wp.mce.av ) {
		extend = _.extend( {}, wp.mce.av, {
			View: _.extend( {}, wp.mce.av.View, {
				action: 'cue_parse_shortcode'
			}),
			edit: null
		} );
	}

	wp.mce.views.register( 'cue', extend );

} )( jQuery, wp );
