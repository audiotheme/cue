<?php
/**
 * Cue administration.
 *
 * @package Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license GPL-2.0+
 * @since 1.0.0
 */

/**
 * Set up the playlist admin.
 *
 * @since 1.0.0
 *
 * @param WP_Post $post Playlist post object.
 */
function cue_playlist_load_admin( $post ) {
	wp_enqueue_media();
	wp_enqueue_style( 'genericons', CUE_URL . 'assets/styles/genericons.css' );
	wp_enqueue_style( 'cue-admin', CUE_URL . 'admin/assets/styles/admin.min.css', array( 'genericons', 'mediaelement' ) );

	wp_enqueue_script(
		'cue-admin',
		CUE_URL . 'admin/assets/scripts/cue.min.js',
		array(
			'backbone',
			'jquery-ui-sortable',
			'media-upload',
			'media-views',
			'mediaelement',
			'wp-util',
		),
		'1.0.0',
		true
	);

	wp_localize_script( 'cue-admin', '_cueSettings', array(
		'tracks'   => get_cue_playlist_tracks( $post->ID, 'edit' ),
		'settings' => array(
			'pluginPath' => includes_url( 'js/mediaelement/', 'relative' ),
			'postId'     => $post->ID,
			'saveNonce'  => wp_create_nonce( 'save-tracks_' . $post->ID ),
		),
		'l10n' => array(
			'addTracks'  => __( 'Add Tracks', 'cue' ),
			'addFromUrl' => __( 'Add from URL', 'cue' ),
			'workflows'  => array(
				'selectArtwork' => array(
					'fileTypes'       => __( 'Image Files', 'cue' ),
					'frameTitle'      => __( 'Choose an Image', 'cue' ),
					'frameButtonText' => __( 'Update Image', 'cue' ),
				),
				'selectAudio'   => array(
					'fileTypes'       => __( 'Audio Files', 'cue' ),
					'frameTitle'      => __( 'Choose an Audio File', 'cue' ),
					'frameButtonText' => __( 'Update Audio', 'cue' ),
				),
				'addTracks'     => array(
					'fileTypes'       => __( 'Audio Files', 'cue' ),
					'frameTitle'      => __( 'Choose Tracks', 'cue' ),
					'frameButtonText' => __( 'Add Tracks', 'cue' ),
				),
			),
		),
	) );

	add_meta_box(
		'cueplaylistshortcodediv',
		__( 'Shortcode', 'cue' ),
		'cue_playlist_shortcode_meta_box',
		'cue_playlist',
		'side',
		'default'
	);

	add_action( 'edit_form_after_title', 'cue_playlist_edit_view' );
	add_action( 'admin_footer', 'cue_playlist_edit_templates' );
}
add_action( 'add_meta_boxes_cue_playlist', 'cue_playlist_load_admin' );

/**
 * Display the basic starting view.
 *
 * @since 1.0.0
 *
 * @param WP_Post $post Playlist post object.
 */
function cue_playlist_edit_view( $post ) {
	?>
	<div id="cue-section" class="cue-section">
		<h3 class="cue-section-title"><?php _e( 'Tracks' ); ?></h3>
		<p>
			<?php _e( 'Add tracks to the playlist, then drag and drop to reorder them. Click the arrow on the right of each item to reveal more configuration options.', 'cue' ); ?>
		</p>
	</div>
	<?php
}

/**
 * Display a meta box with instructions to embed the playlist.
 *
 * @since 1.0.0
 *
 * @param WP_Post $post Post object.
 */
function cue_playlist_shortcode_meta_box( $post ) {
	?>
	<p>
		<?php _e( 'Copy and paste the following shortcode into a post or page to embed this playlist.', 'cue' ); ?>
	</p>
	<p>
		<input type="text" value="<?php echo esc_attr( '[cue id="' . $post->ID . '"]' ); ?>" readonly>
	</p>
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
function cue_prepare_audio_attachment_for_js( $response, $attachment, $meta ) {
	if ( 'audio' !== $response['type'] ) {
		return $response;
	}

	$data = array();

	// Fall back to the attachment title if the audio meta doesn't have one.
	$data['title'] = empty( $meta['title'] ) ? $response['title'] : $meta['title'];
	$data['artist'] = empty( $meta['artist'] ) ? '' : $meta['artist'];
	$data['audioId'] = $attachment->ID;
	$data['audioUrl'] = $response['url'];
	$data['format'] = empty( $meta['dataformat'] ) ? '' : $meta['dataformat'];
	$data['length'] = empty( $response['fileLength'] ) ? '' : $response['fileLength'];
	$data['length'] = empty( $data['length'] ) && ! empty( $meta['length_formatted'] ) ? $meta['length_formatted'] : $data['length'];

	if ( has_post_thumbnail( $attachment->ID ) ) {
		$thumbnail_id = get_post_thumbnail_id( $attachment->ID );
		$size = apply_filters( 'cue_artwork_size', array( 300, 300 ) );
		$image = image_downsize( $thumbnail_id, $size );

		$data['artworkId'] = $thumbnail_id;
		$data['artworkUrl'] = $image[0];
	}

	$response['cue'] = $data;

	return $response;
}
add_filter( 'wp_prepare_attachment_for_js', 'cue_prepare_audio_attachment_for_js', 20, 3 );

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
function cue_prepare_image_attachment_for_js( $response, $attachment, $meta ) {
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
add_filter( 'wp_prepare_attachment_for_js', 'cue_prepare_image_attachment_for_js', 20, 3 );

/**
 * Playlist update messages.
 *
 * @since 1.0.0
 * @see /wp-admin/edit-form-advanced.php
 *
 * @param array $messages The array of post update messages.
 * @return array
 */
function cue_playlist_updated_messages( $messages ) {
	global $post;

	$post_type = 'cue_playlist';
	$post_type_object = get_post_type_object( $post_type );

	$messages[ $post_type ] = array(
		0  => '', // Unused. Messages start at index 1.
		1  => __( 'Playlist updated.', 'cue' ),
		2  => __( 'Custom field updated.', 'cue' ),
		3  => __( 'Custom field deleted.', 'cue' ),
		4  => __( 'Playlist updated.', 'cue' ),
		// translators: %s: date and time of the revision
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Playlist restored to revision from %s', 'cue' ),
		      wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		6  => __( 'Playlist published.', 'cue' ),
		7  => __( 'Playlist saved.', 'cue' ),
		8  => __( 'Playlist submitted.', 'cue' ),
		9  => sprintf( __( 'Playlist scheduled for: <strong>%1$s</strong>.', 'cue' ),
		      // translators: Publish box date format, see http://php.net/date
		      date_i18n( __( 'M j, Y @ G:i', 'cue' ), strtotime( $post->post_date ) ) ),
		10 => __( 'Playlist draft updated.', 'cue' ),
	);

	if ( $post_type_object->publicly_queryable ) {
		$view_link = sprintf(
			' <a href="%s">%s</a>',
			esc_url( get_permalink( $post->ID ) ),
			__( 'View playlist', 'cue' )
		);
		$messages[ $post_type ][1] .= $view_link;
		$messages[ $post_type ][6] .= $view_link;
		$messages[ $post_type ][9] .= $view_link;

		$preview_link = sprintf(
			' <a target="_blank" href="%s">%s</a>',
			esc_url( add_query_arg( 'preview', 'true', get_permalink( $post->ID ) ) ),
			__( 'Preview Playlist', 'cue' )
		);
		$messages[ $post_type ][8]  .= $preview_link;
		$messages[ $post_type ][10] .= $preview_link;
	}

	return $messages;
}
add_filter( 'post_updated_messages', 'cue_playlist_updated_messages' );

/**
 * Global admin CSS.
 *
 * @since 1.0.0
 */
function cue_admin_head() {
	?>
	<style type="text/css">
	#adminmenu #menu-posts-cue_playlist div.wp-menu-image.svg { background-position: 50% 7px;}
	</style>
	<?php
}
add_action( 'admin_head', 'cue_admin_head' );

/**
 * Include the HTML templates.
 *
 * @since 1.0.0
 */
function cue_playlist_edit_templates() {
	include( CUE_DIR . 'admin/includes/templates.php' );
}
