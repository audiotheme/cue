import cue from 'cue';
import { blocks } from 'wp';
import PlaylistBlockEdit from './edit';

const { registerBlockType } = blocks;

const ICON = (
	<svg x="0px" y="0px" viewBox="0 0 20 20">
		<path d="M11,8h7v2h-7V8z M7,3v7.3C6.5,10.1,6,10,5.5,10C3.6,10,2,11.6,2,13.5S3.6,17,5.5,17S9,15.4,9,13.5V6h9V3H7z M11,13h7v-2h-7 V13z M11,16h7v-2h-7V16z"/>
	</svg>
);

registerBlockType( 'cue/playlist', {
	icon: ICON,

	edit: PlaylistBlockEdit,

	save: function({ attributes, className }) {
		return null;
	}
});
