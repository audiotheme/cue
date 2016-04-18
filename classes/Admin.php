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
class Cue_Admin {
	/**
	 * Load administration functionality.
	 *
	 * @since 1.0.0
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts',        array( $this, 'enqueue_assets' ) );
		add_action( 'admin_head',                   array( $this, 'admin_head' ) );
		add_filter( 'wp_prepare_attachment_for_js', array( $this, 'prepare_audio_attachment_for_js' ), 20, 3 );
		add_filter( 'wp_prepare_attachment_for_js', array( $this, 'prepare_image_attachment_for_js' ), 20, 3 );
	}

	/**
	 * Enqueue a script for rendering the Cue shortcode in the editor.
	 *
	 * @since 1.2.9
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( 'post.php' !== $hook_suffix && 'post-new.php' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_script(
			'cue-mce-view',
			CUE_URL . 'admin/assets/js/mce-view.js',
			array( 'jquery', 'mce-view', 'underscore' ),
			'1.0.0',
			true
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
	 * Prepare an audio attachment for JavaScript.
	 *
	 * Filters the core method and inserts data using 'cue' as the top level key.
	 *
	 * @since 1.0.0
	 *
	 * @param array $response Response data.
	 * @param WP_Post $attachment Attachment object.
	 * @param array $meta Attachment metadata.
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
	 * @param array $response Response data.
	 * @param WP_Post $attachment Attachment object.
	 * @param array $meta Attachment metadata.
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
