<?php
/**
 * Cue
 *
 * @package   Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license   GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: Cue
 * Plugin URI:  https://audiotheme.com/view/cue/?utm_source=wordpress-plugin&utm_medium=link&utm_content=cue-plugin-uri&utm_campaign=plugins
 * Description: Create beautiful, fully responsive audio playlists.
 * Version:     2.3.3
 * Author:      AudioTheme
 * Author URI:  https://audiotheme.com/?utm_source=wordpress-plugin&utm_medium=link&utm_content=cue-author-uri&utm_campaign=plugins
 * License:     GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cue
 */

/**
 * Autoloader callback.
 *
 * Converts a class name to a file path and requires it if it exists.
 *
 * @since 1.0.0
 *
 * @param string $class Class name.
 */
function cue_autoloader( $class ) {
	if ( 0 !== strpos( $class, 'Cue_' ) ) {
		return;
	}

	$file  = dirname( __FILE__ ) . '/classes/';
	$file .= str_replace( array( 'Cue_', '_' ), array( '', '/' ), $class );
	$file .= '.php';

	if ( file_exists( $file ) ) {
		require_once( $file );
	}
}
spl_autoload_register( 'cue_autoloader' );

/**
 * Retrieve the main plugin instance.
 *
 * @since 1.0.0
 *
 * @return Cue_Plugin
 */
function cue() {
	static $instance;

	if ( null === $instance ) {
		$instance = new Cue_Plugin();
	}

	return $instance;
}

$GLOBALS['cue'] = cue()
	->set_basename( plugin_basename( __FILE__ ) )
	->set_directory( plugin_dir_path( __FILE__ ) )
	->set_file( __FILE__ )
	->set_slug( 'cue' )
	->set_url( plugin_dir_url( __FILE__ ) )
	->register_hooks( new Cue_Provider_I18n() )
	->register_hooks( new Cue_Provider_Customize() )
	->register_hooks( new Cue_PostType_Playlist() )
	->register_hooks( new Cue_Provider_Assets() )
	->register_hooks( new Cue_Provider_Shortcode() )
	->register_hooks( new Cue_Provider_Media() );

/**
 * Include functions and libraries.
 */
if ( ! class_exists( 'Gamajo_Template_Loader' ) ) {
	require( cue()->get_path( 'vendor/class-gamajo-template-loader.php' ) );
}

require( cue()->get_path( 'includes/deprecated.php' ) );
require( cue()->get_path( 'includes/functions.php' ) );

/**
 * Include admin functions and libraries.
 */
if ( is_admin() ) {
	cue()
		->register_hooks( new Cue_Admin() )
		->register_hooks( new Cue_Provider_AdminAssets() )
		->register_hooks( new Cue_Screen_EditPlaylist() )
		->register_hooks( new Cue_Provider_AJAX() );
}

// Instantiate and load the plugin.
add_action( 'plugins_loaded', array( cue(), 'load_plugin' ) );
