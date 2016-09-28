<?php
/**
 * Cue administration.
 *
 * @package   Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     1.0.0
 */

/**
 * Plugin administration setup class.
 *
 * @package Cue
 * @since 1.0.0
 */
class Cue_Admin extends Cue_AbstractProvider {
	/**
	 * Load administration functionality.
	 *
	 * @since 1.0.0
	 */
	public function register_hooks() {
		// @todo Most of these should be moved to the Media provider.
		add_action( 'wp_enqueue_media',             array( $this, 'enqueue_assets' ) );
		add_action( 'admin_head',                   array( $this, 'admin_head' ) );
		add_action( 'admin_footer',                 array( $this, 'print_templates' ) );
		add_filter( 'wp_prepare_attachment_for_js', array( $this, 'prepare_audio_attachment_for_js' ), 20, 3 );
		add_filter( 'wp_prepare_attachment_for_js', array( $this, 'prepare_image_attachment_for_js' ), 20, 3 );
	}

	/**
	 * Enqueue a script for rendering the Cue shortcode in the editor.
	 *
	 * @since 1.2.9
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_assets( $hook_suffix ) {
		wp_enqueue_script(
			'cue-mce-view',
			$this->plugin->get_url( 'admin/assets/js/mce-view.js' ),
			array( 'jquery', 'mce-view', 'underscore' ),
			'1.0.0',
			true
		);

		wp_enqueue_script(
			'cue-media',
			$this->plugin->get_url( 'admin/assets/js/wp-media.bundle.js' ),
			array( 'media-views', 'wp-backbone', 'wp-util' ),
			'1.0.0',
			true
		);

		wp_localize_script( 'cue-media', '_cueMediaSettings', array(
			'l10n' => array(
				'insertFromCue'  => esc_html__( 'Insert from Cue', 'cue' ),
				'insertPlaylist' => esc_html__( 'Insert Playlist', 'cue' ),
			),
		) );

		wp_enqueue_style(
			'cue-media',
			$this->plugin->get_url( 'admin/assets/css/wp-media.min.css' )
		);
	}

	/**
	 * Global admin CSS.
	 *
	 * @since 1.0.0
	 */
	public function admin_head() {
		?>
		<style type="text/css">
		#adminmenu #menu-posts-cue_playlist div.wp-menu-image.svg { background-position: 50% 7px;}
		</style>
		<?php
	}

	/**
	 * Include the HTML templates.
	 *
	 * @since 2.2.0
	 */
	public function print_templates() {
		if ( 'post' !== get_current_screen()->base ) {
			return;
		}

		include( $this->plugin->get_path( 'admin/views/templates-media.php' ) );
	}

	/**
	 * Prepare an audio attachment for JavaScript.
	 *
	 * Filters the core method and inserts data using 'cue' as the top level key.
	 *
	 * @since 1.0.0
	 *
	 * @param array   $response   Response data.
	 * @param WP_Post $attachment Attachment object.
	 * @param array   $meta       Attachment metadata.
	 * @return array
	 */
	public function prepare_audio_attachment_for_js( $response, $attachment, $meta ) {
		if ( 'audio' !== $response['type'] ) {
			return $response;
		}

		$data = array();

		// Fall back to the attachment title if the audio meta doesn't have one.
		$data['title']    = empty( $meta['title'] ) ? $response['title'] : $meta['title'];
		$data['artist']   = empty( $meta['artist'] ) ? '' : $meta['artist'];
		$data['audioId']  = $attachment->ID;
		$data['audioUrl'] = $response['url'];
		$data['format']   = empty( $meta['dataformat'] ) ? '' : $meta['dataformat'];
		$data['length']   = empty( $response['fileLength'] ) ? '' : $response['fileLength'];
		$data['length']   = empty( $data['length'] ) && ! empty( $meta['length_formatted'] ) ? $meta['length_formatted'] : $data['length'];

		if ( has_post_thumbnail( $attachment->ID ) ) {
			$thumbnail_id = get_post_thumbnail_id( $attachment->ID );
			$size         = apply_filters( 'cue_artwork_size', array( 300, 300 ) );
			$image        = image_downsize( $thumbnail_id, $size );

			$data['artworkId']  = $thumbnail_id;
			$data['artworkUrl'] = $image[0];
		}

		$response['cue'] = $data;

		return $response;
	}

	/**
	 * Prepare an image attachment for JavaScript.
	 *
	 * Adds an image size to use for artwork.
	 *
	 * @since 1.0.0
	 *
	 * @param array   $response   Response data.
	 * @param WP_Post $attachment Attachment object.
	 * @param array   $meta       Attachment metadata.
	 * @return array
	 */
	public function prepare_image_attachment_for_js( $response, $attachment, $meta ) {
		if ( 'image' !== $response['type'] ) {
			return $response;
		}

		$size = apply_filters( 'cue_artwork_size', array( 300, 300 ) );
		$image = image_downsize( $attachment->ID, $size );

		$response['sizes']['cue'] = array(
			'height'      => $image[2],
			'width'       => $image[1],
			'url'         => $image[0],
			'orientation' => $image[2] > $image[1] ? 'portrait' : 'landscape',
		);

		return $response;
	}
}
