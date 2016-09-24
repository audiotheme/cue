/*global _:false, jQuery:false, wp:false */

(function( $, wp ) {
	'use strict';

	var extend,
		postID = $( '#post_ID' ).val() || 0;

	extend = {
		action: 'cue_parse_shortcode',
		state: [ 'cue-playlists' ],

		initialize: function() {
			var self = this;

			if ( this.url ) {
				this.loader = false;
				this.shortcode = wp.media.embed.shortcode( {
					url: this.text
				} );
			}

			wp.ajax.post( this.action, {
				post_ID: postID,
				type: this.shortcode.tag,
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

		edit: function( text, update ) {
			// var state = wp.media.editor.open().setState( 'cue-playlists' ),
			// shortcode = wp.shortcode.next( 'cue', text ).shortcode;
		},

		pausePlayers: function() {
			this.getNodes( function( editor, node, content ) {
				var win = $( 'iframe.wpview-sandbox', content ).get( 0 );

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
