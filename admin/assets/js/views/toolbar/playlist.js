var PlaylistToolbar,
	_ = require( 'underscore' ),
	wp = require( 'wp' );

PlaylistToolbar = wp.media.view.Toolbar.extend({
	initialize: function( options ) {
		this.controller = options.controller;

		_.bindAll( this, 'insertCueShortcode' );

		// This is a button.
		this.options.items = _.defaults( this.options.items || {}, {
			insert: {
				text: wp.media.view.l10n.insertIntoPost || 'Insert into post',
				style: 'primary',
				priority: 80,
				requires: {
					selection: true
				},
				click: this.insertCueShortcode
			}
		});

		wp.media.view.Toolbar.prototype.initialize.apply( this, arguments );
	},

	insertCueShortcode: function() {
		var html,
			state = this.controller.state(),
			attributes = state.get( 'attributes' ).toJSON(),
			selection = state.get( 'selection' ).first();

		attributes.id = selection.get( 'id' );
		_.pick( attributes, 'id', 'theme', 'width', 'show_playlist' );

		if ( ! attributes.show_playlist ) {
			attributes.show_playlist = '0';
		} else {
			delete attributes.show_playlist;
		}

		html = wp.shortcode.string({
			tag: 'cue',
			type: 'single',
			attrs: attributes
		});

		wp.media.editor.insert( html );
		this.controller.close();
	}
});

module.exports = PlaylistToolbar;
