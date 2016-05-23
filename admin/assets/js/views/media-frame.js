var MediaFrame,
	_ = require( 'underscore' ),
	l10n = require( 'cue' ).l10n,
	wp = require( 'wp' );

MediaFrame = wp.media.view.MediaFrame.Post.extend({
	createStates: function() {
		var options = this.options;

		// Add the default states.
		this.states.add([
			// Main states.
			new wp.media.controller.Library({
				id: 'insert',
				title: this.options.title,
				priority: 20,
				toolbar: 'main-insert',
				filterable: 'uploaded',
				library: wp.media.query( options.library ),
				multiple: options.multiple ? 'reset' : false,
				editable: false,

				// If the user isn't allowed to edit fields,
				// can they still edit it locally?
				allowLocalEdits: true,

				// Show the attachment display settings.
				displaySettings: false,
				// Update user settings when users adjust the
				// attachment display settings.
				displayUserSettings: false
			}),

			// Embed states.
			new wp.media.controller.Embed({
				title: l10n.addFromUrl,
				menuItem: { text: l10n.addFromUrl, priority: 120 },
				type: 'link'
			})
		]);
	},

	bindHandlers: function() {
		wp.media.view.MediaFrame.Select.prototype.bindHandlers.apply( this, arguments );

		this.on( 'toolbar:create:main-insert', this.createToolbar, this );
		this.on( 'toolbar:create:main-embed', this.mainEmbedToolbar, this );

		var handlers = {
				menu: {
					'default': 'mainMenu'
				},

				content: {
					'embed': 'embedContent',
					'edit-selection': 'editSelectionContent'
				},

				toolbar: {
					'main-insert': 'mainInsertToolbar'
				}
			};

		_.each( handlers, function( regionHandlers, region ) {
			_.each( regionHandlers, function( callback, handler ) {
				this.on( region + ':render:' + handler, this[ callback ], this );
			}, this );
		}, this );
	},

	// Toolbars.
	mainInsertToolbar: function( view ) {
		var controller = this;

		this.selectionStatusToolbar( view );

		view.set( 'insert', {
			style: 'primary',
			priority: 80,
			text: controller.options.button.text,
			requires: {
				selection: true
			},
			click: function() {
				var state = controller.state(),
					selection = state.get( 'selection' );

				controller.close();
				state.trigger( 'insert', selection ).reset();
			}
		});
	},

	mainEmbedToolbar: function( toolbar ) {
		toolbar.view = new wp.media.view.Toolbar.Embed({
			controller: this,
			text: this.options.button.text
		});
	}
});

module.exports = MediaFrame;
