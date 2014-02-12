<?php
/**
 * Cue
 *
 * @package Cue
 * @author Brady Vercher
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: Cue
 * Plugin URI: http://audiotheme.com/
 * Description: Create beautiful, fully responsive audio playlists.
 * Version: 1.0.1
 * Author: AudioTheme
 * Author URI: http://audiotheme.com/
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cue
 * Domain Path: /languages
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
		self::define_constants();
		self::includes();

		add_action( 'init', array( $this, 'init' ), 15 );
		add_action( 'widgets_init', array( $this, 'widgets_init' ) );
		add_action( 'cue_before_playlist', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Localize the plugin strings.
	 *
	 * @since 1.0.0
	 */
	protected function load_textdomain() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'cue' );
		load_textdomain( 'cue', WP_LANG_DIR . '/cue/cue-' . $locale . '.mo' );
		load_plugin_textdomain( 'cue', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Define useful constants.
	 *
	 * @since 1.0.0
	 */
	protected function define_constants() {
		// Plugin directory URL.
		if ( ! defined( 'CUE_URL' ) ) {
			define( 'CUE_URL', plugin_dir_url( __FILE__ ) );
		}

		// Plugin directory path.
		if ( ! defined( 'CUE_DIR' ) ) {
			define( 'CUE_DIR', plugin_dir_path( __FILE__ ) );
		}
	}

	/**
	 * Include functions and libraries.
	 *
	 * @since 1.0.0
	 */
	protected function includes() {
		if ( ! class_exists( 'Gamajo_Template_Loader' ) ) {
			require( CUE_DIR . 'includes/vendor/class-gamajo-template-loader.php' );
		}

		// Load includes.
		foreach ( glob( CUE_DIR . 'includes/*.php' ) as $file ) {
			require( $file );
		}

		// Load the admin.
		if ( is_admin() ) {
			require( CUE_DIR . 'admin/admin.php' );
			require( CUE_DIR . 'admin/includes/ajax.php' );
		}
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
		add_shortcode( 'cue', 'cue_shortcode_handler' );
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
	public function enqueue_assets() {
		wp_enqueue_style( 'cue' );
		wp_enqueue_script( 'cue' );
	}
}

$GLOBALS['cue'] = new Cue();
add_action( 'plugins_loaded', array( $cue, 'load_plugin' ) );
