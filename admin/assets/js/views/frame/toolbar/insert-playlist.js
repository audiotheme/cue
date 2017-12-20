import _ from 'underscore';
import wp from 'wp';

const { l10n, Toolbar } = wp.media.view;

export const InsertPlaylistToolbar = Toolbar.extend({
	initialize: function( options ) {
		this.controller = options.controller;

		this.insert = this.insert.bind( this );

		// This is a button.
		this.options.items = _.defaults( this.options.items || {}, {
			insert: {
				text: l10n.insertIntoPost || 'Insert into post',
				style: 'primary',
				priority: 80,
				requires: {
					selection: true
				},
				click: this.insert
			}
		});

		Toolbar.prototype.initialize.apply( this, arguments );
	},

	insert: function() {
		const state = this.controller.state();
		const attributes = state.get( 'attributes' ).toJSON();
		const selection = state.get( 'selection' ).first();

		attributes.id = selection.get( 'id' );
		_.pick( attributes, 'id', 'theme', 'width', 'show_playlist' );

		if ( ! attributes.show_playlist ) {
			attributes.show_playlist = '0';
		} else {
			delete attributes.show_playlist;
		}

		const html = wp.shortcode.string({
			tag: 'cue',
			type: 'single',
			attrs: attributes
		});

		wp.media.editor.insert( html );
		this.controller.close();
	}
});
