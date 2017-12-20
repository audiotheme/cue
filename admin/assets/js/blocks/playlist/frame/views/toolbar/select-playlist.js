import _ from 'underscore';
import wp from 'wp';

export default wp.media.view.Toolbar.extend({
	initialize: function( options ) {
		this.controller = options.controller;

		this.select = this.select.bind( this );

		// This is a button.
		this.options.items = _.defaults( this.options.items || {}, {
			select: {
				text: wp.media.view.l10n.insertIntoPost || 'Insert into post',
				style: 'primary',
				priority: 80,
				requires: {
					selection: true
				},
				click: this.select
			}
		});

		wp.media.view.Toolbar.prototype.initialize.apply( this, arguments );
	},

	select: function() {
		var state = this.controller.state(),
			selection = state.get( 'selection' );

		this.controller.close();
		state.trigger( 'select', selection );
	}
});
