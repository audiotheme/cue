<?php
/**
 * Cue
 *
 * @package Cue
 * @author Brady Vercher
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license GPL-2.0+
 */

/**
 * Main plugin class.
 *
 * @package Cue
 * @since 1.0.0
 */
class Cue {
	/**
	 * Load the plugin.
	 *
	 * @since 1.0.0
	 */
	public function load_plugin() {
		self::load_textdomain();

		if ( is_admin() ) {
			self::load_admin();
		}

		add_action( 'init', array( $this, 'init' ), 15 );
		add_action( 'widgets_init', array( $this, 'widgets_init' ) );
		add_action( 'cue_after_playlist', array( $this, 'print_playlist_settings' ), 10, 2 );
	}

	/**
	 * Localize the plugin strings.
	 *
	 * @since 1.0.0
	 */
	protected function load_textdomain() {
		load_plugin_textdomain( 'cue', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Load admin functionality.
	 *
	 * @since 1.1.0
	 */
	protected function load_admin() {
		$admin = new Cue_Admin();
		$admin->load();
	}

	/**
	 * Attach hooks and load custom functionality on init.
	 *
	 * @since 1.0.0
	 */
	public function init() {
		self::register_post_type();

		// Register scripts and styles.
		self::register_assets();

		// Add a shortcode to include a playlist in a post.
		add_shortcode( 'cue', array( $this, 'cue_shortcode_handler' ) );
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
	 * Register the playlist post type.
	 *
	 * @since 1.0.0
	 */
	protected function register_post_type() {
		$labels = array(
			'name'               => _x( 'Playlists', 'post format general name', 'cue' ),
			'singular_name'      => _x( 'Playlist', 'post format singular name', 'cue' ),
			'add_new'            => _x( 'Add New', 'playlist', 'cue' ),
			'add_new_item'       => __( 'Add New Playlist', 'cue' ),
			'edit_item'          => __( 'Edit Playlist', 'cue' ),
			'new_item'           => __( 'New Playlist', 'cue' ),
			'view_item'          => __( 'View Playlist', 'cue' ),
			'search_items'       => __( 'Search Playlists', 'cue' ),
			'not_found'          => __( 'No playlists found.', 'cue' ),
			'not_found_in_trash' => __( 'No playlists found in Trash.', 'cue' ),
			'all_items'          => __( 'All Playlists', 'cue' ),
			'menu_name'          => __( 'Playlists', 'cue' ),
			'name_admin_bar'     => _x( 'Playlist', 'add new on admin bar', 'cue' )
		);

		$args = array(
			'can_export'         => true,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'labels'             => $labels,
			'menu_icon'          => 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAgMjAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxyZWN0IGZpbGw9IiMwMTAxMDEiIHg9IjEiIHk9IjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyIi8+PHBhdGggZmlsbD0iIzAxMDEwMSIgZD0iTTEzLjAxIDMuMDMxdjcuMzVjLTAuNDU2LTAuMjE4LTAuOTYxLTAuMzUtMS41LTAuMzVjLTEuOTMzIDAtMy41IDEuNTY3LTMuNSAzLjVzMS41NjcgMy41IDMuNSAzLjVzMy41LTEuNTY3IDMuNS0zLjV2LTcuNSBsNC0xdi0zTDEzLjAxIDMuMDMxeiIvPjxwYXRoIGZpbGw9IiMwMTAxMDEiIGQ9Ik02LjAxIDEzLjUzMWMwLTAuMTcxIDAuMDMyLTAuMzMzIDAuMDQ4LTAuNUgxLjAxdjJoNS4yMTNDNi4wODggMTQuNiA2IDE0LjEgNiAxMy41MzF6Ii8+PHBhdGggZmlsbD0iIzAxMDEwMSIgZD0iTTcuMjk0IDEwLjAzMUgxLjAxdjJoNS4yMzNDNi40NTUgMTEuMyA2LjggMTAuNiA3LjMgMTAuMDMxeiIvPjxwYXRoIGZpbGw9IiMwMTAxMDEiIGQ9Ik0xMS4wMSA4LjA1NFY3LjAzMWgtMTB2Mmg3LjM2N0M5LjE0IDguNSAxMCA4LjEgMTEgOC4wNTR6Ii8+PC9zdmc+',
			'public'             => false,
			'publicly_queryable' => false,
			'rewrite'            => false,
			'show_ui'            => true,
			'show_in_admin_bar'  => false,
			'show_in_menu'       => true,
			'show_in_nav_menus'  => false,
			'supports'           => array( 'title', 'thumbnail' ),
		);

		$args = apply_filters( 'cue_playlist_args', $args );

		register_post_type( 'cue_playlist', $args );
	}

	/**
	 * Register scripts and styles.
	 *
	 * @since 1.0.0
	 */
	protected function register_assets() {
		wp_register_style( 'cue', CUE_URL . 'assets/styles/cue.min.css', array( 'mediaelement' ), '1.0.0' );

		wp_register_script( 'cue', CUE_URL . 'assets/scripts/cue.min.js', array( 'cue-vague', 'jquery', 'mediaelement' ), '1.0.0', true );
		wp_register_script( 'cue-vague', CUE_URL . 'assets/scripts/vendor/Vague.js', array( 'jquery' ), '1.0.0', true );

		wp_localize_script( 'cue', '_cueSettings', array(
			'pluginPath' => includes_url( 'js/mediaelement/', 'relative' ),
			'l10n' => array(
				'nextTrack'     => __( 'Next Track', 'cue' ),
				'previousTrack' => __( 'Previous Track' ),
			),
		) );
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
	 * Playlist shortcode handler.
	 *
	 * @since 1.0.0
	 *
	 * @param array $atts Optional. List of shortcode attributes.
	 * @return string HTML output.
	 */
	public function cue_shortcode_handler( $atts = array() ) {
		$atts = shortcode_atts(
			array(
				'id'       => 0,
				'template' => '',
			),
			$atts
		);

		$id = $atts['id'];
		unset( $atts['id'] );

		ob_start();
		cue_playlist( $id, $atts );
		return ob_get_clean();
	}

	/**
	 * Print playlist settings as a JSON script tag.
	 *
	 * @since 1.1.0
	 *
	 * @param WP_Post $playlist Playlist post object.
	 * @param array $tracks List of tracks.
	 */
	public function print_playlist_settings( $playlist, $tracks ) {
		$thumbnail = '';
		if ( has_post_thumbnail( $playlist->ID ) ) {
			$thumbnail_id = get_post_thumbnail_id( $playlist->ID );
			$size = apply_filters( 'cue_artwork_size', array( 300, 300 ) );
			$image = image_downsize( $thumbnail_id, $size );
			$thumbnail = $image[0];
		}

		$settings = apply_filters( 'cue_playlist_settings', array(
			'thumbnail' => $thumbnail,
			'tracks'    => $tracks,
		) );
		?>
		<script type="application/json" class="cue-playlist-data"><?php echo json_encode( $settings ); ?></script>
		<?php
	}
}
