import cue from 'cue';
import { blocks, components, editor, element, i18n } from 'wp';
import SandBox from './sandbox';
import SelectPlaylistFrame from '../../views/frame/select-playlist';

const { PanelBody, Placeholder, SelectControl, ToggleControl, Toolbar } = components;
const { BlockControls, InspectorControls } = editor;
const { Component, Fragment } = element;
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

	// static getDerivedStateFromProps( props, state ) {
	// 	const shouldRefresh = [ 'playlistId', 'showPlaylist', 'theme' ].reduce( ( shouldRefresh, attribute ) => {
	// 		return shouldRefresh || props.attributes[ attribute ] !== state[ attribute ];
	// 	}, false );
	//
	// 	return null;
	// }
	//
	// componentWillReceiveProps( nextProps ) {
	// 	if ( ! nextProps.attributes.playlistId ) {
	// 		return;
	// 	}
	//
	// 	const shouldRefresh = [ 'playlistId', 'showPlaylist', 'theme' ].reduce( ( shouldRefresh, attribute ) => {
	// 		return shouldRefresh || this.props.attributes[ attribute ] !== nextProps.attributes[ attribute ];
	// 	}, false );
	//
	// 	if ( ! shouldRefresh ) {
	// 		return;
	// 	}
	//
	// 	this.request = getPreview( nextProps.attributes );
	//
	// 	this.request.done( response => {
	// 		this.setState({
	// 			head: response.head,
	// 			body: response.body
	// 		});
	// 	});
	// }

	componentDidUpdate( prevProps ) {
		const shouldRefresh = [ 'playlistId', 'showPlaylist', 'theme' ].reduce( ( shouldRefresh, attribute ) => {
			return shouldRefresh || this.props.attributes[ attribute ] !== prevProps.attributes[ attribute ];
		}, false );

		if ( ! shouldRefresh ) {
			return;
		}

		this.request = getPreview( this.props.attributes );

		this.request.done( response => {
			this.setState({
				head: response.head,
				body: response.body
			});
		});
	}

	componentWillUnmount() {
		if ( this.request && 'pending' === this.request.state() ) {
			this.request.abort();
		}
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
