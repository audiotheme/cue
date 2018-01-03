import wp from 'wp';

import { InsertPlaylistToolbar } from './toolbar/insert-playlist';
import { PlaylistBrowser } from './content/playlist-browser';
import { PlaylistsController } from '../../controllers/playlists';

const { Post: PostFrame } = wp.media.view.MediaFrame;


export default PostFrame.extend({
	createStates: function() {
		PostFrame.prototype.createStates.apply( this, arguments );

		this.states.add( new PlaylistsController({}) );
	},

	bindHandlers: function() {
		PostFrame.prototype.bindHandlers.apply( this, arguments );

		this.on( 'content:create:cue-playlist-browser', this.createCueContent, this );
		this.on( 'toolbar:create:cue-insert-playlist', this.createCueToolbar, this );
	},

	createCueContent: function( content ) {
		content.view = new PlaylistBrowser({
			controller: this
		});
	},

	createCueToolbar: function( toolbar ) {
		toolbar.view = new InsertPlaylistToolbar({
			controller: this
		});
	}
});
