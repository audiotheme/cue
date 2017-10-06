<?php
/**
 * Admin assets provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Admin assets provider class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Provider_AdminAssets extends Cue_AbstractProvider {
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
		add_action( 'admin_enqueue_scripts',    array( $this, 'register_assets' ), 1 );
	}

	/**
	 * Register frontend scripts and styles.
	 *
	 * @since 2.0.0
	 */
	public function register_assets() {
		wp_register_style(
			'cue-admin',
			$this->plugin->get_url( 'admin/assets/css/admin.min.css' ),
			array( 'dashicons', 'mediaelement' )
		);
	}
}
