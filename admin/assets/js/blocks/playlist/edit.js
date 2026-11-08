import cue from 'cue';
import { blockEditor, components, element, i18n } from 'wp';
import ICON from './icon';
import SandBox from './sandbox';
import SelectPlaylistFrame from '../../views/frame/select-playlist';

const { BlockControls, InspectorControls, useBlockProps } = blockEditor;
const { Button, PanelBody, Placeholder, SelectControl, ToggleControl, ToolbarGroup } = components;
const { RawHTML, useEffect, useRef, useState } = element;
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

/**
 * Create the playlist media frame once and keep it for the life of the block.
 *
 * The frame's event handlers read from a ref so they always see the latest
 * attributes without having to rebind them on every render.
 */
function usePlaylistFrame( playlistId, setAttributes ) {
	const frameRef = useRef( null );
	const latest = useRef({ playlistId, setAttributes });
	latest.current = { playlistId, setAttributes };

	useEffect( () => {
		const frame = new SelectPlaylistFrame();
		frame.setState( 'cue-playlists' );

		const onOpen = () => {
			const selection = frame.state().get( 'selection' );

			if ( latest.current.playlistId ) {
				selection.reset([ { id: latest.current.playlistId } ]);
			}
		};

		const onSelect = selection => {
			latest.current.setAttributes({
				playlistId: selection.first().get( 'id' )
			});
		};

		frame.on( 'open', onOpen );
		frame.on( 'select', onSelect );
		frameRef.current = frame;

		return () => {
			frame.off( 'open', onOpen );
			frame.off( 'select', onSelect );
			frameRef.current = null;
		};
	}, []);

	return () => frameRef.current && frameRef.current.open();
}

/**
 * Fetch the rendered playlist markup whenever the relevant attributes change.
 */
function usePlaylistPreview({ playlistId, showPlaylist, theme }) {
	const [ preview, setPreview ] = useState({ head: '', body: '' });

	useEffect( () => {
		if ( ! playlistId ) {
			return;
		}

		let isCurrent = true;
		const request = getPreview({ playlistId, showPlaylist, theme });

		request.done( response => {
			if ( isCurrent ) {
				setPreview({ head: response.head, body: response.body });
			}
		});

		return () => {
			isCurrent = false;

			if ( 'pending' === request.state() ) {
				request.abort();
			}
		};
	}, [ playlistId, showPlaylist, theme ]);

	return preview;
}

export default function PlaylistBlockEdit({ attributes, setAttributes }) {
	const { playlistId, showPlaylist, theme } = attributes;
	const blockProps = useBlockProps();
	const openModal = usePlaylistFrame( playlistId, setAttributes );
	const { head, body } = usePlaylistPreview( attributes );

	if ( ! body ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ ICON }
					label={ l10n.cuePlaylist || __( 'Cue Playlist' ) }
					instructions={ l10n.clickToChoose || __( 'Click to choose a playlist.' ) }>
					<Button __next40pxDefaultSize variant="primary" onClick={ openModal }>
						{ l10n.choosePlaylist || __( 'Choose Playlist' ) }
					</Button>
				</Placeholder>
			</div>
		);
	}

	const toolbarControls = [
		{
			icon: 'edit',
			title: l10n.choosePlaylist || __( 'Choose Playlist' ),
			onClick: openModal
		}
	];

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label={ l10n.showPlaylist || __( 'Show the playlist' ) }
						checked={ showPlaylist }
						onChange={ () => setAttributes({ showPlaylist: ! showPlaylist }) }
					/>
					<SelectControl
						label={ l10n.theme || __( 'Theme' ) }
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
				<ToolbarGroup controls={ toolbarControls }></ToolbarGroup>
			</BlockControls>

			<SandBox
				head={ head }
				body={ body }
				title={ l10n.cuePlaylist || __( 'Cue Playlist' ) }
			/>
		</div>
	);
}
