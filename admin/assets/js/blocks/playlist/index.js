import cue from 'cue';
import { blocks } from 'wp';
import PlaylistBlockEdit from './edit';
import ICON from './icon';

const { registerBlockType } = blocks;

registerBlockType( 'cue/playlist', {
	apiVersion: 3,

	icon: ICON,

	edit: PlaylistBlockEdit,

	save: function({ attributes, className }) {
		return null;
	}
});
