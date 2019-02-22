<?php
/**
 * Editor provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.4.0
 */

/**
 * Editor provider class.
 *
 * @package Cue
 * @since   2.4.0
 */
class Cue_Provider_Editor extends Cue_AbstractProvider {
	/**
	 * Register hooks.
	 *
	 * @since 2.4.0
	 */
	public function register_hooks() {
		add_action( 'init',                        array( $this, 'register_block_types' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
	}

	/**
	 * Register block types.
	 *
	 * @since 2.4.0
	 */
	public function register_block_types() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type( 'cue/playlist', array(
			'title'       => esc_html__( 'Cue', 'cue' ),
			'description' => esc_html__( 'The Cue block allows you to display an audio playlist in your content.', 'cue' ),
			'icon'        => '',
			'category'    => 'common',
			'attributes'  => array(
				'playlistId' => array(
					'type' => 'integer',
				),
				'showPlaylist' => array(
					'type' => 'boolean',
					'default' => true,
				),
				'theme' => array(
					'type' => 'string',
				),
			),
			'supports'    => array(
				'html' => false,
			),
			'render_callback' => array( $this, 'render_playlist_block' ),
		) );
	}

	/**
	 * Enqueue editor assets.
	 *
	 * @since 2.4.0
	 */
	public function enqueue_editor_assets() {
		wp_enqueue_script(
			'cue-block-editor',
			$this->plugin->get_url( 'admin/assets/js/editor.bundle.js' ),
			array( 'media-views', 'underscore', 'wp-blocks', 'wp-editor', 'wp-element', 'wp-util' ),
			'20171219'
		);

		$upgrade_message = '';
		if ( ! function_exists( 'cuepro' ) ) {
			$upgrade_message = wp_kses( sprintf(
				/* translators: %s: Cue Pro plugin URL. */
				__( '<a href="%s" target="_blank" rel="noopener noreferrer">Upgrade to Cue Pro</a> to access more themes.', 'cue' ), // WPCS: XSS ok.
				'https://audiotheme.com/view/cuepro/?utm_source=wordpress-plugin&utm_medium=link&utm_content=cue-theme-description&utm_campaign=plugins'
			), array( 'a' => array( 'href' => true, 'target' => true ) ) );
		}

		wp_localize_script( 'cue-block-editor', '_cueEditorSettings', array(
			'parseNonce' => wp_create_nonce( 'cue_parse_shortcode' ),
			'themes'     => get_cue_themes(),
			'l10n'       => array(
				'choosePlaylist' => esc_html__( 'Choose Playlist', 'cue' ),
				'clickToChoose'  => esc_html__( 'Click to choose a playlist.', 'cue' ),
				'cuePlaylist'    => esc_html__( 'Cue Playlist', 'cue' ),
				'selectPlaylist' => esc_html__( 'Select Playlist', 'cue' ),
				'showPlaylist'   => esc_html__( 'Show the playlist', 'cue' ),
				'theme'          => esc_html__( 'Theme', 'cue' ),
				'upgrade'        => $upgrade_message,
			),
		) );
	}

	/**
	 * Render the playlist block.
	 *
	 * @param array $attributes Array of block attributes.
	 * @return string
	 */
	public function render_playlist_block( $attributes ) {
		ob_start();

		cue_playlist( $attributes['playlistId'], array(
			'show_playlist' => $attributes['showPlaylist'],
			'theme'         => $attributes['theme'],
		) );

		return ob_get_clean();
	}
}
