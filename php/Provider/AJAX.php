<?php
/**
 * AJAX provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * AJAX provider class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Provider_AJAX extends Cue_AbstractProvider {
	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	public function register_hooks() {
		add_action( 'wp_ajax_cue_get_playlists',        array( $this, 'get_playlists' ) );
		add_action( 'wp_ajax_cue_get_playlist_tracks',  array( $this, 'get_playlist_tracks' ) );
		add_action( 'wp_ajax_cue_save_playlist_tracks', array( $this, 'save_playlist_tracks' ) );
		add_action( 'wp_ajax_cue_parse_shortcode',      array( $this, 'parse_shortcode' ) );
	}

	/**
	 * AJAX callback to retrieve playlists.
	 *
	 * @since 2.2.0
	 */
	public function get_playlists() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error();
		}

		$data = array();
		$page = isset( $_POST['paged'] ) ? max( 1, absint( $_POST['paged'] ) ) : 1;
		$posts_per_page = isset( $_POST['posts_per_page'] ) ? absint( $_POST['posts_per_page'] ) : 40;
		$posts_per_page = min( max( 1, $posts_per_page ), 100 );

		$playlists = new WP_Query( array(
			'post_type'      => 'cue_playlist',
			'post_status'    => 'publish',
			'posts_per_page' => $posts_per_page,
			'paged'          => $page,
		) );

		if ( $playlists->have_posts() ) {
			foreach ( $playlists->posts as $playlist ) {
				$image = wp_get_attachment_image_src( get_post_thumbnail_id( $playlist->ID ), array( 120, 120 ) );

				$data[ $playlist->ID ] = array(
					'id'        => $playlist->ID,
					'title'     => $playlist->post_title,
					'thumbnail' => $image[0] ?? '',
				);
			}
		}

		$send['maxNumPages'] = $playlists->max_num_pages;
		$send['playlists'] = array_values( $data );

		wp_send_json_success( $send );
	}

	/**
	 * AJAX callback to retrieve a playlist's tracks.
	 *
	 * @since 2.0.0
	 */
	public function get_playlist_tracks() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;

		if ( empty( $post_id ) || 'cue_playlist' !== get_post_type( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error();
		}

		wp_send_json_success( get_cue_playlist_tracks( $post_id, 'edit' ) );
	}

	/**
	 * AJAX callback to save a playlist's tracks.
	 *
	 * Tracks are currently saved to post meta.
	 *
	 * @since 2.0.0
	 */
	public function save_playlist_tracks() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;

		check_ajax_referer( 'save-tracks_' . $post_id, 'nonce' );

		if ( 'cue_playlist' !== get_post_type( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error();
		}

		// Sanitize the list of tracks.
		$tracks = empty( $_POST['tracks'] ) ? array() : (array) wp_unslash( $_POST['tracks'] );
		foreach ( $tracks as $key => $track ) {
			if ( empty( $track ) || ! is_array( $track ) ) {
				unset( $tracks[ $key ] );
				continue;
			}

			$tracks[ $key ] = sanitize_cue_track( $track, 'save' );
		}

		$tracks = array_values( $tracks );

		// Save the list of tracks to post meta.
		update_post_meta( $post_id, 'tracks', $tracks );

		// Response data.
		$data = array(
			'nonce' => wp_create_nonce( 'save-tracks_' . $post_id ),
		);

		// Send the response.
		wp_send_json_success( $data );
	}

	/**
	 * Parse the Cue shortcode for display within a TinyMCE view.
	 *
	 * @since 1.3.0
	 */
	public function parse_shortcode() {
		global $wp_scripts;

		check_ajax_referer( 'cue_parse_shortcode' );

		if ( ! current_user_can( 'edit_posts' ) || empty( $_POST['shortcode'] ) || ! is_string( $_POST['shortcode'] ) ) {
			wp_send_json_error();
		}

		$shortcode = trim( wp_unslash( $_POST['shortcode'] ) );

		// Only render a single [cue] shortcode, not other shortcodes appended to it.
		if ( ! preg_match( '/^\[cue\s[^\[\]]*\]$/', $shortcode ) ) {
			wp_send_json_error();
		}

		$shortcode = do_shortcode( $shortcode );

		if ( empty( $shortcode ) ) {
			wp_send_json_error( array(
				'type'    => 'no-items',
				'message' => esc_html__( 'No items found.', 'cue' ),
			) );
		}

		$head  = '';
		$styles = wpview_media_sandbox_styles();

		// @codingStandardsIgnoreStart
		foreach ( $styles as $style ) {
			$head .= '<link type="text/css" rel="stylesheet" href="' . $style . '">'; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet

		}

		$head .= '<link rel="stylesheet" href="' . $this->plugin->get_url( 'assets/css/cue.min.css' ) . '">'; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet
		$head .= '<style type="text/css">.cue-tracks { max-height: none;}</style>';
		// @codingStandardsIgnoreEnd

		if ( ! empty( $wp_scripts ) ) {
			$wp_scripts->done = array();
		}

		ob_start();
		echo $shortcode; // WPCS: XSS ok.
		wp_print_scripts( 'cue' );

		wp_send_json_success( array(
			'head' => apply_filters( 'cue_parse_shortcode_head', $head ),
			'body' => ob_get_clean(),
		) );
	}
}
