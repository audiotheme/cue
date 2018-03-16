<?php
/**
 * Assets provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Assets provider class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Provider_Assets extends Cue_AbstractProvider {
	/**
	 * File suffix for minified assets.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected $suffix = '.min';

	/**
	 * Constructor method.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
			$this->suffix = '';
		}
	}

	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	public function register_hooks() {
		// Register early so assets are available in the TinyMCE view AJAX callback.
		add_action( 'init', array( $this, 'register_assets' ), 15 );
	}

	/**
	 * Register frontend scripts and styles.
	 *
	 * @since 2.0.0
	 */
	public function register_assets() {
		wp_register_style(
			'cue',
			$this->plugin->get_url( 'assets/css/cue.min.css' ),
			array( 'mediaelement' ),
			'2.3.0'
		);

		wp_style_add_data( 'cue', 'rtl', 'replace' );
		wp_style_add_data( 'cue', 'suffix', '.min' );

		wp_register_script(
			'jquery-cue',
			$this->plugin->get_url( "assets/js/vendor/jquery.cue{$this->suffix}.js" ),
			array( 'jquery', 'mediaelement' ),
			'1.2.4',
			true
		);

		wp_register_script(
			'cue',
			$this->plugin->get_url( 'assets/js/cue.min.js' ),
			array( 'jquery-cue' ),
			'2.3.0',
			true
		);

		wp_localize_script( 'cue', '_cueSettings', array(
			'l10n' => array(
				'nextTrack'      => esc_html__( 'Next Track', 'cue' ),
				'previousTrack'  => esc_html__( 'Previous Track', 'cue' ),
				'togglePlayer'   => esc_html__( 'Toggle Player', 'cue' ),
				'togglePlaylist' => esc_html__( 'Toggle Playlist', 'cue' ),
			),
		) );

		wp_register_script(
			'cue-wp-mediaelement',
			$this->plugin->get_url( 'assets/js/wp-mediaelement.js' ),
			array( 'wp-mediaelement' ),
			'2.3.0',
			true
		);
	}
}
