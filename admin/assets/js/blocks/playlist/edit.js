import cue from 'cue';
import { blockEditor, blocks, components, element, i18n } from 'wp';
import SandBox from './sandbox';
import SelectPlaylistFrame from '../../views/frame/select-playlist';

const { BlockControls, InspectorControls } = blockEditor;
const { PanelBody, Placeholder, SelectControl, ToggleControl, Toolbar } = components;
const { Component, Fragment, RawHTML } = element;
const { __ } = i18n;

cue.config( _cueEditorSettings );
const { l10n, settings } = cue;
const { parseNonce, themes } = settings;
const themeOptions = Object.keys( themes ).map( key => ({ label: themes[ key ], value: key }) );

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

export default class PlaylistBlockEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onOpen = this.onOpen.bind( this );
		this.onSelect = this.onSelect.bind( this );
		this.openModal = this.openModal.bind( this );
		this.refreshPreview = this.refreshPreview.bind( this );
		this.togglePlaylist = this.togglePlaylist.bind( this );

		this.state = {
			head: '',
			body: ''
		};

		// Initialize the playlist frame.
		const frame = new SelectPlaylistFrame();
		frame.setState( 'cue-playlists' );
		frame.on( 'open', this.onOpen );
		frame.on( 'select', this.onSelect );
		this.frame = frame;
	}

	componentDidMount() {
		if ( this.props.attributes.playlistId ) {
			this.request = getPreview( this.props.attributes );
			this.request.done( this.refreshPreview );
		}
	}

	componentDidUpdate( prevProps ) {
		const shouldRefresh = [ 'playlistId', 'showPlaylist', 'theme' ].reduce( ( shouldRefresh, attribute ) => {
			return shouldRefresh || this.props.attributes[ attribute ] !== prevProps.attributes[ attribute ];
		}, false );

		if ( ! shouldRefresh ) {
			return;
		}

		this.request = getPreview( this.props.attributes );
		this.request.done( this.refreshPreview );
	}

	componentWillUnmount() {
		if ( this.request && 'pending' === this.request.state() ) {
			this.request.abort();
		}
	}

	onOpen() {
		const { playlistId } = this.props.attributes;
		const selection = this.frame.state().get( 'selection' );

		if ( playlistId ) {
			selection.reset([ { id: playlistId } ]);
		}
	}

	onSelect( selection ) {
		this.props.setAttributes({
			playlistId: selection.first().get( 'id' )
		});
	}

	openModal() {
		this.frame.open();
	}

	refreshPreview( response ) {
		this.setState({
			head: response.head,
			body: response.body
		});
	}

	togglePlaylist() {
		const { showPlaylist } = this.props.attributes;
		this.props.setAttributes({ showPlaylist: ! showPlaylist });
	}

	render() {
		const { attributes, className, setAttributes } = this.props;
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

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
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
						<RawHTML style={ { fontStyle: 'italic' } }>
							{ l10n.upgrade }
						</RawHTML>
					</PanelBody>
				</InspectorControls>
				<BlockControls>
					<Toolbar controls={ toolbarControls }></Toolbar>
				</BlockControls>

				<SandBox
					head={ head }
					body={ body }
					title={ l10n.cuePlaylist || __( 'Cue Playlist' ) }
				/>
			</Fragment>
		);
	}
}
