import wp from 'wp';

import { l10n } from 'cue';

const { MediaFrame, Toolbar } = wp.media.view;
const { Post: PostFrame, Select: SelectFrame } = MediaFrame;

export const TrackMediaFrame = PostFrame.extend({
	createStates: function() {
		const options = this.options;

		this.states.add([
			new wp.media.controller.Library({
				id: 'insert',
				title: options.title,
				priority: 20,
				toolbar: 'main-insert',
				filterable: 'uploaded',
				library: wp.media.query( options.library ),
				multiple: options.multiple ? 'reset' : false,
				editable: false,
				allowLocalEdits: true,
				displaySettings: false,
				displayUserSettings: false
			}),

			new wp.media.controller.Embed({
				title: l10n.addFromUrl,
				menuItem: { text: l10n.addFromUrl, priority: 120 },
				type: 'link'
			})
		]);
	},

	bindHandlers: function() {
		SelectFrame.prototype.bindHandlers.apply( this, arguments );

		this.on( 'toolbar:create:main-insert', this.createToolbar, this );
		this.on( 'toolbar:create:main-embed', this.mainEmbedToolbar, this );

		this.on( 'menu:render:default', this.mainMenu, this );

		this.on( 'content:render:embed', this.embedContent, this );
		this.on( 'content:render:edit-selection', this.editSelectionContent, this );

		this.on( 'toolbar:render:main-insert', this.mainInsertToolbar, this );
	},

	mainInsertToolbar: function( view ) {
		this.selectionStatusToolbar( view );

		view.set( 'insert', {
			style: 'primary',
			priority: 80,
			text: this.options.button.text,
			requires: {
				selection: true
			},
			click: () => {
				const state = this.state();
				const selection = state.get( 'selection' );

				this.close();
				state.trigger( 'insert', selection ).reset();
			}
		});
	},

	mainEmbedToolbar: function( toolbar ) {
		toolbar.view = new Toolbar.Embed({
			controller: this,
			text: this.options.button.text
		});
	}
});
