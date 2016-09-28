<?php
/**
 * Cue
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Main plugin class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Plugin extends Cue_AbstractPlugin {
	/**
	 * Load the plugin.
	 *
	 * @since 2.0.0
	 */
	public function load_plugin() {
		add_action( 'widgets_init',        array( $this, 'widgets_init' ) );
		add_action( 'cue_after_playlist',  array( $this, 'print_playlist_settings' ), 10, 3 );
		add_filter( 'cue_playlist_tracks', array( $this, 'wp_playlist_tracks_format' ), 10, 3 );
	}

	/**
	 * Register the playlist widget.
	 *
	 * @since 1.0.0
	 */
	public function widgets_init() {
		register_widget( 'Cue_Widget_Playlist' );
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @since 1.0.0
	 */
	public static function enqueue_assets() {
		wp_enqueue_style( 'cue' );
		wp_enqueue_script( 'cue' );
	}

	/**
	 * Print playlist settings as a JSON script tag.
	 *
	 * @since 1.1.0
	 *
	 * @param WP_Post $playlist Playlist post object.
	 * @param array   $tracks   List of tracks.
	 * @param array   $args     Playlist arguments.
	 */
	public function print_playlist_settings( $playlist, $tracks, $args ) {
		if ( isset( $args['print_data'] ) && ! $args['print_data'] ) {
			return;
		}

		$thumbnail = '';
		if ( has_post_thumbnail( $playlist->ID ) ) {
			$thumbnail_id = get_post_thumbnail_id( $playlist->ID );
			$size = apply_filters( 'cue_artwork_size', array( 300, 300 ) );
			$size = apply_filters( 'cue_playlist_thumbnail_size', $size, $playlist, $args );
			$image = image_downsize( $thumbnail_id, $size );
			$thumbnail = $image[0];
		}

		$settings = apply_filters(
			'cue_playlist_settings',
			array(
				'embed_link' => get_cue_embed_link( $playlist, $args ),
				'permalink'  => get_permalink( $playlist->ID ),
				'skin'       => sprintf( 'cue-skin-%s', sanitize_html_class( $args['theme'] ) ),
				'thumbnail'  => $thumbnail,
				'tracks'     => $tracks,
			),
			$playlist,
			$args
		);
		?>
		<script type="application/json" class="cue-playlist-data"><?php echo wp_json_encode( $settings ); ?></script>
		<?php
	}

	/**
	 * Transform the Cue track syntax into the format used by WP Playlists.
	 *
	 * @since 1.1.1
	 *
	 * @param array   $tracks   Array of tracks.
	 * @param WP_Post $playlist Playlist post object.
	 * @param string  $context  Context the tracks will be used in.
	 * @return array
	 */
	public function wp_playlist_tracks_format( $tracks, $playlist, $context ) {
		if ( ! empty( $tracks ) ) { // 'wp-playlist' == $context &&
			foreach ( $tracks as $key => $track ) {
				$tracks[ $key ]['meta'] = array(
					'artist'           => $track['artist'],
					'length_formatted' => $track['length'],
				);

				$tracks[ $key ]['src'] = $track['audioUrl'];
				$tracks[ $key ]['thumb']['src'] = $track['artworkUrl'];
			}
		}

		return $tracks;
	}
}
