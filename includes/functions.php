<?php
/**
 * Cue API methods and template tags.
 *
 * @package   Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     1.0.0
 */

/**
 * Display a playlist.
 *
 * @since 1.0.0
 * @todo Add an arg to specify a template path that doesn't exist in the /cue directory.
 *
 * @param mixed $post A post ID, WP_Post object or post slug.
 * @param array $args Playlist arguments.
 */
function cue_playlist( $post, $args = array() ) {
	if ( is_string( $post ) && ! is_numeric( $post ) ) {
		// Get a playlist by its slug.
		$post = get_page_by_path( $post, OBJECT, 'cue_playlist' );
	} else {
		$post = get_post( $post );
	}

	if ( ! $post || 'cue_playlist' !== get_post_type( $post ) ) {
		return;
	}

	$tracks = get_cue_playlist_tracks( $post );

	if ( empty( $tracks ) ) {
		return;
	}

	$args = wp_parse_args( $args, array(
		'container'     => true,
		'enqueue'       => true,
		'print_data'    => true,
		'show_playlist' => true,
		'player'        => '',
		'theme'         => get_cue_default_theme(),
		'template'      => '',
	) );

	if ( $args['enqueue'] ) {
		Cue::enqueue_assets();
	}

	$template_names = array(
		"playlist-{$post->ID}.php",
		"playlist-{$post->post_name}.php",
		'playlist.php',
	);

	// Prepend custom templates.
	if ( ! empty( $args['template'] ) ) {
		$add_templates = array_filter( (array) $args['template'] );
		$template_names = array_merge( $add_templates, $template_names );
	}

	$template_loader = new Cue_Template_Loader();
	$template = $template_loader->locate_template( $template_names );

	$themes = get_cue_themes();
	if ( ! isset( $themes[ $args['theme'] ] ) ) {
		$args['theme'] = 'default';
	}

	$classes   = array( 'cue-playlist' );
	$classes[] = $args['show_playlist'] ? '' : 'is-playlist-hidden';
	$classes[] = sprintf( 'cue-theme-%s', sanitize_html_class( $args['theme'] ) );
	$classes   = implode( ' ', array_filter( $classes ) );

	if ( $args['container'] ) {
		echo '<div class="cue-playlist-container">';
	}

	do_action( 'cue_before_playlist', $post, $tracks, $args );

	include( $template );

	do_action( 'cue_after_playlist', $post, $tracks, $args );

	if ( $args['container'] ) {
		echo '</div>';
	}
}

/**
 * Retrieve a playlist's tracks.
 *
 * @since 1.0.0
 *
 * @param int|WP_Post $post    Playlist ID or post object.
 * @param string      $context Optional. Context to retrieve the tracks for. Defaults to display.
 * @return array
 */
function get_cue_playlist_tracks( $post = 0, $context = 'display' ) {
	$playlist = get_post( $post );
	$tracks = array_filter( (array) $playlist->tracks );

	// Add the audio file extension as a key pointing to the audio url.
	// Helpful for use with the jPlayer Playlist plugin.
	foreach ( $tracks as $key => $track ) {
		$parts = wp_parse_url( $track['audioUrl'] );
		if ( ! empty( $parts['path'] ) ) {
			$ext = pathinfo( $parts['path'], PATHINFO_EXTENSION );
			if ( ! empty( $ext ) ) {
				$tracks[ $key ][ $ext ] = $track['audioUrl'];
			}
		}
	}

	return apply_filters( 'cue_playlist_tracks', $tracks, $playlist, $context );
}

/**
 * Retrieve a default track.
 *
 * Useful for whitelisting allowed keys.
 *
 * @since 1.0.0
 *
 * @return array
 */
function get_cue_default_track() {
	$args = array(
		'artist'     => '',
		'artworkId'  => '',
		'artworkUrl' => '',
		'audioId'    => '',
		'audioUrl'   => '',
		'length'     => '',
		'format'     => '',
		'order'      => '',
		'title'      => '',
	);

	return apply_filters( 'cue_default_track_properties', $args );
}

/**
 * Sanitize a track based on the context.
 *
 * @since 1.0.0
 *
 * @param array  $track   Track data.
 * @param string $context Optional. Context to sanitize data for. Defaults to display.
 * @return array
 */
function sanitize_cue_track( $track, $context = 'display' ) {
	if ( 'save' === $context ) {
		$valid_props = get_cue_default_track();

		// Remove properties that aren't in the whitelist.
		$track = array_intersect_key( $track, $valid_props );

		// Sanitize valid properties.
		$track['artist']     = sanitize_text_field( $track['artist'] );
		$track['artworkId']  = absint( $track['artworkId'] );
		$track['artworkUrl'] = esc_url_raw( $track['artworkUrl'] );
		$track['audioId']    = absint( $track['audioId'] );
		$track['audioUrl']   = esc_url_raw( $track['audioUrl'] );
		$track['length']     = sanitize_text_field( $track['length'] );
		$track['format']     = sanitize_text_field( $track['format'] );
		$track['title']      = sanitize_text_field( $track['title'] );
		$track['order']      = absint( $track['order'] );
	}

	return apply_filters( 'cue_sanitize_track', $track, $context );
}

/**
 * Display a theme-registered player.
 *
 * @since 1.1.0
 *
 * @param string $player_id Player ID.
 * @param array  $args      Playlist arguments.
 */
function cue_player( $player_id, $args = array() ) {
	$playlist_id = get_cue_player_playlist_id( $player_id );

	$args = array(
		'enqueue'  => false,
		'player'   => $player_id,
		'template' => array(
			"player-{$player_id}.php",
			'player.php',
		),
	);

	cue_playlist( $playlist_id, $args );
}

/**
 * Retrieve a list of players registered by the current them.
 *
 * Includes the player id, name and associated playlist if one has been saved.
 *
 * @since 1.1.0
 *
 * @return array
 */
function get_cue_players() {
	$players = array();
	$assigned = get_theme_mod( 'cue_players', array() );

	/**
	 * List of registered players.
	 *
	 * Format: array( 'player_id' => 'Player Name' )
	 *
	 * @since 1.1.0
	 *
	 * @param array $players List of players.
	 */
	$registered = apply_filters( 'cue_players', array() );

	if ( ! empty( $registered ) ) {
		asort( $registered );
		foreach ( $registered as $id => $name ) {
			$playlist_id = isset( $assigned[ $id ] ) ? $assigned[ $id ] : 0;

			$players[ $id ] = array(
				'id'          => $id,
				'name'        => $name,
				'playlist_id' => $playlist_id,
			);
		}
	}

	return $players;
}

/**
 * Retreive the ID of a playlist connected to a player.
 *
 * @since 1.1.0
 *
 * @param string $player_id Player ID.
 * @return int
 */
function get_cue_player_playlist_id( $player_id ) {
	$players = get_theme_mod( 'cue_players', array() );
	return isset( $players[ $player_id ] ) ? $players[ $player_id ] : 0;
}

/**
 * Retrieve playlist tracks for a registered player.
 *
 * @since 1.1.0
 *
 * @param string $player_id Player ID.
 * @param array  $args {
 *     An array of arguments. Optional.
 *
 *     @type string $context Context to retrieve the tracks for. Defaults to display.
 * }
 * @return array
 */
function get_cue_player_tracks( $player_id, $args = array() ) {
	$args = wp_parse_args( $args, array(
		'context' => 'display',
	) );

	$playlist_id = get_cue_player_playlist_id( $player_id );
	return get_cue_playlist_tracks( $playlist_id, $args['context'] );
}

/**
 * Retrieve registered themes.
 *
 * @since 2.1.0
 *
 * @return array
 */
function get_cue_themes() {
	return apply_filters( 'cue_themes', array(
		'default' => esc_html__( 'Default', 'cue' ),
	) );
}

/**
 * Retrieve the default theme.
 *
 * @since 2.1.0
 *
 * @return string
 */
function get_cue_default_theme() {
	return get_option( 'cue_default_theme', 'default' );
}

/**
 * Retrieve the default theme to use for native audio shortcodes.
 *
 * @since 2.1.0
 *
 * @return string
 */
function get_cue_default_native_theme() {
	return get_option( 'cue_native_theme', 'default' );
}

/**
 * Retrieve the theme to use for a single native audio shortcode.
 *
 * @since 2.1.0
 *
 * @param  array $atts Shortcode attributes.
 * @return string
 */
function get_cue_native_theme( $atts ) {
	$theme = get_cue_default_native_theme();
	if ( ! empty( $atts['theme'] ) ) {
		$theme = $atts['theme'];
	}

	return $theme;
}

/**
 * Retrieve the link for embedding a playlist.
 *
 * @since 2.1.0
 *
 * @param WP_Post $post Post object.
 * @param array   $args Array of extra arguments.
 * @return string
 */
function get_cue_embed_link( $post, $args = array() ) {
	$post = get_post( $post );

	$themes = get_cue_themes();
	if ( ! isset( $themes[ $args['theme'] ] ) ) {
		$args['theme'] = 'default';
	}

	$query_args = array(
		'cue_embed' => $post->post_name,
		'cue_theme' => $args['theme'],
	);

	return add_query_arg( $query_args, home_url( '/' ) );
}
