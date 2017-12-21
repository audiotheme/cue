import _ from 'underscore';
import wp from 'wp';

const { l10n, Toolbar } = wp.media.view;

export default Toolbar.extend({
	initialize: function( options ) {
		this.controller = options.controller;

		this.select = this.select.bind( this );

		// This is a button.
		this.options.items = _.defaults( this.options.items || {}, {
			select: {
				text: l10n.insertIntoPost || 'Insert into post',
				style: 'primary',
				priority: 80,
				requires: {
					selection: true
				},
				click: this.select
			}
		});

		Toolbar.prototype.initialize.apply( this, arguments );
	},

	select: function() {
		const state = this.controller.state();
		const selection = state.get( 'selection' );

		this.controller.close();
		state.trigger( 'select', selection );
	}
});
