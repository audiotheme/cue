import { l10n } from 'cue';
import wp from 'wp';
import { PlaylistBrowser } from './content/playlist-browser';
import SelectPlaylistToolbar from './toolbar/select-playlist';
import { PlaylistsController } from '../../controllers/playlists';

const { Select: SelectFrame } = wp.media.view.MediaFrame;

export default SelectFrame.extend({
	className: 'media-frame cue-playlists-frame cue-playlists-frame--select',

	createStates: function() {
		this.states.add( new PlaylistsController({
			title: l10n.selectPlaylist || 'Select Playlist'
		}) );
	},

	bindHandlers: function() {
		SelectFrame.prototype.bindHandlers.apply( this, arguments );

		this.on( 'content:create:cue-playlist-browser', this.createCueContent, this );
		this.on( 'toolbar:create:cue-insert-playlist', this.createCueToolbar, this );
	},

	createCueContent: function( content ) {
		content.view = new PlaylistBrowser({
			controller: this
		});
	},

	createCueToolbar: function( toolbar ) {
		toolbar.view = new SelectPlaylistToolbar({
			controller: this
		});
	}
});
