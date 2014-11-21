<?php
/**
 * AJAX callbacks for privileged users.
 *
 * @package Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license GPL-2.0+
 * @since 1.0.0
 */

/**
 * AJAX callback to retrieve a playlist's tracks.
 *
 * @since 1.0.0
 */
function cue_ajax_get_playlist() {
	wp_send_json_success( get_cue_playlist_tracks( $_POST['post_id'], 'edit' ) );
}

/**
 * AJAX callback to save a playlist's tracks.
 *
 * Tracks are currently saved to post meta.
 *
 * @since 1.0.0
 */
function cue_ajax_save_playlist_tracks() {
	$post_id = absint( $_POST['post_id'] );

	check_ajax_referer( 'save-tracks_' . $post_id, 'nonce' );

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_send_json_error();
	}

	// Sanitize the list of tracks.
	$tracks = empty( $_POST['tracks'] ) ? array() : stripslashes_deep( $_POST['tracks'] );
	foreach ( (array) $tracks as $key => $track ) {
		if ( empty( $track ) ) {
			unset( $tracks[ $key ] );
			continue;
		}

		$tracks[ $key ] = sanitize_cue_track( $track, 'save' );
	}

	// Save the list of tracks to post meta.
	update_post_meta( $post_id, 'tracks', $tracks );

	// Response data.
	$data = array(
		'nonce' => wp_create_nonce( 'save-tracks_' . $post_id )
	);

	// Send the response.
	wp_send_json_success( $data );
}

/**
 * Parse the Cue shortcode for display within a TinyMCE view.
 *
 * @since 1.3.0
 */
function cue_ajax_parse_shortcode() {
	global $wp_scripts;

	if ( empty( $_POST['shortcode'] ) ) {
		wp_send_json_error();
	}

	$shortcode = do_shortcode( wp_unslash( $_POST['shortcode'] ) );

	if ( empty( $shortcode ) ) {
		wp_send_json_error( array(
			'type' => 'no-items',
			'message' => __( 'No items found.' ),
		) );
	}

	$head  = '';
	$styles = wpview_media_sandbox_styles();

	foreach ( $styles as $style ) {
		$head .= '<link type="text/css" rel="stylesheet" href="' . $style . '">';
	}

	$head .= '<link rel="stylesheet" href="' . CUE_URL . 'assets/css/cue.min.css' . '">';
	$head .= '<style type="text/css">.cue-tracks { max-height: none;}</style>';

	if ( ! empty( $wp_scripts ) ) {
		$wp_scripts->done = array();
	}

	ob_start();
	echo $shortcode;
	wp_print_scripts( 'cue' );

	wp_send_json_success( array(
		'head' => $head,
		'body' => ob_get_clean(),
	) );
}
