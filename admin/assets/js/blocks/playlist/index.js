import { blocks, components, element, i18n } from 'wp';

import cue from 'cue';
import SandBox from './sandbox';
import SelectPlaylistFrame from '../../views/frame/select-playlist';

const { Component } = element;
const { __ } = i18n;
const { registerBlockType } = blocks;
const { BlockControls, BlockDescription, InspectorControls } = blocks;
const { SelectControl, ToggleControl } = InspectorControls;
const { Placeholder, Toolbar } = components;

cue.config( _cueEditorSettings );
const { l10n, settings } = cue;
const { parseNonce, themes } = settings;
const themeOptions = Object.keys( themes ).map( key => ({ label: themes[ key ], value: key }) );

const ICON = (
	<svg x="0px" y="0px" viewBox="0 0 20 20">
		<path d="M11,8h7v2h-7V8z M7,3v7.3C6.5,10.1,6,10,5.5,10C3.6,10,2,11.6,2,13.5S3.6,17,5.5,17S9,15.4,9,13.5V6h9V3H7z M11,13h7v-2h-7 V13z M11,16h7v-2h-7V16z"/>
	</svg>
);

function getPreview( attributes ) {
	return wp.ajax.post( 'cue_parse_shortcode', {
		_ajax_nonce: parseNonce,
		shortcode: wp.shortcode.string({
			tag: 'cue',
			type: 'single',
			attrs: {
				id: attributes.playlistId,
				show_playlist: attributes.showPlaylist,
				theme: attributes.theme
			}
		})
	});
}

registerBlockType( 'cue/playlist', {
	icon: ICON,

	edit: class extends Component {
		constructor() {
			super( ...arguments );

			this.onOpen = this.onOpen.bind( this );
			this.onSelect = this.onSelect.bind( this );
			this.openModal = this.openModal.bind( this );
			this.togglePlaylist = this.togglePlaylist.bind( this );

			this.state = {
				head: '',
				body: ''
			};

			if ( this.props.attributes.playlistId ) {
				this.request = getPreview( this.props.attributes );

				this.request.done( response => {
					this.setState({
						head: response.head,
						body: response.body
					});
				});
			}

			// Initialize the playlist frame.
			const frame = new SelectPlaylistFrame();
			frame.setState( 'cue-playlists' );
			frame.on( 'open', this.onOpen );
			frame.on( 'select', this.onSelect );
			this.frame = frame;
		}

		componentWillReceiveProps( nextProps ) {
			if ( ! nextProps.attributes.playlistId ) {
				return;
			}

			const shouldRefresh = [ 'playlistId', 'showPlaylist', 'theme' ].reduce( ( shouldRefresh, attribute ) => {
				return shouldRefresh || this.props.attributes[ attribute ] !== nextProps.attributes[ attribute ];
			}, false );

			if ( ! shouldRefresh ) {
				return;
			}

			this.request = getPreview( nextProps.attributes );

			this.request.done( response => {
				this.setState({
					head: response.head,
					body: response.body
				});
			})
		}

		onOpen() {
			const { playlistId } = this.props.attributes;
			const selection = this.frame.state().get( 'selection' );
			// @todo Update the selection.
		}

		onSelect( selection ) {
			this.props.setAttributes({
				playlistId: selection.first().get( 'id' )
			});
		}

		openModal() {
			this.frame.open();
		}

		togglePlaylist() {
			const { showPlaylist } = this.props.attributes;
			this.props.setAttributes({ showPlaylist: ! showPlaylist });
		}

		render() {
			const { attributes, className, focus, setAttributes, setFocus } = this.props;
			const { playlistId, showPlaylist, theme } = attributes;

			const { head, body } = this.state;

			if ( ! body ) {
				return (
					<Placeholder
						key="placeholder"
						icon="playlist-audio"
						label={ l10n.cuePlaylist || __( 'Cue Playlist' ) }
						instructions={ l10n.clickToChoose || __( 'Click to choose a playlist.' ) }>
						<button onClick={ this.openModal } className="button">
							{ l10n.choosePlaylist || __( 'Choose Playlist' ) }
						</button>
					</Placeholder>
				);
			}

			const toolbarControls = [
				{
					icon: 'edit',
					title: l10n.choosePlaylist || __( 'Choose Playlist' ),
					onClick: this.openModal
				}
			];

			return ([
				focus && (
					<BlockControls key="controls">
						<Toolbar controls={ toolbarControls }></Toolbar>
					</BlockControls>
				),
				focus && (
					<InspectorControls key="inspector">
						<BlockDescription>
							<p>{ l10n.blockDescription || __( 'The Cue block allows you to display an audio playlist in your content.' ) }</p>
						</BlockDescription>
						<ToggleControl
							label={ l10n.showPlaylist || __( 'Show the playlist' ) }
							checked={ showPlaylist }
							onChange={ this.togglePlaylist }
						/>
						<SelectControl
							label={ __( 'Theme' ) }
							value={ theme }
							options={ themeOptions }
							onChange={ value => setAttributes({ theme: value }) }
						/>
					</InspectorControls>
				),
				<SandBox
					key="preview"
					head={ head }
					body={ body }
					title={ l10n.cuePlaylist || __( 'Cue Playlist' ) }
				/>
			]);
		}

		componentWillUnmount() {
			if ( this.request && 'pending' === this.request.state() ) {
				this.request.abort();
			}
		}
	},

	save: function({ attributes, className }) {
		return null;
	}
});
