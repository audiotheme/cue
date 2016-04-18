<?php
/**
 * Deprecated methods.
 *
 * @package   Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

if ( ! defined( 'CUE_DIR' ) ) {
	/**
	 * Path directory path.
	 *
	 * @since 1.0.0
	 * @type string CUE_DIR
	 */
	define( 'CUE_DIR', plugin_dir_path( dirname( __FILE__ ) ) );
}

if ( ! defined( 'CUE_URL' ) ) {
	/**
	 * URL to the plugin's root directory.
	 *
	 * Includes trailing slash.
	 *
	 * @since 1.0.0
	 * @type string CUE_URL
	 */
	define( 'CUE_URL', plugin_dir_url( dirname( __FILE__ ) ) );
}

class Cue extends Cue_Plugin {}
