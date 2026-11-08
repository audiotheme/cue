<?php
/**
 * Cue
 *
 * @package   Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     1.0.0
 */

/**
 * Template loader.
 *
 * @package Cue
 * @since   1.0.0
 */
class Cue_Template_Loader extends Gamajo_Template_Loader {
	/**
	 * Prefix for filter names.
	 *
	 * @var string
	 */
	protected $filter_prefix = 'cue';

	/**
	 * Directory name where custom templates for this plugin should be found in the theme.
	 *
	 * @var string
	 */
	protected $theme_template_directory = 'cue';

	/**
	 * Reference to the root directory path of this plugin.
	 *
	 * @var string
	 */
	protected $plugin_directory = CUE_DIR;

	/**
	 * Retrieve the name of the highest priority template file that exists.
	 *
	 * Template names can come from user input (the shortcode's "template"
	 * attribute), so unsafe names are discarded and the located file must
	 * live inside one of the registered template directories.
	 *
	 * @since 2.4.6
	 *
	 * @param string|array $template_names Template file(s) to search for, in order.
	 * @param bool         $load           If true the template file will be loaded if it is found.
	 * @param bool         $require_once   Whether to require_once or require. Default true.
	 * @return string|false The template filename if one is located.
	 */
	public function locate_template( $template_names, $load = false, $require_once = true ) {
		$template_names = array_values( array_filter(
			(array) $template_names,
			array( $this, 'is_valid_template_name' )
		) );

		if ( empty( $template_names ) ) {
			return false;
		}

		$located = parent::locate_template( $template_names, false );

		if ( ! $located || ! $this->is_in_template_paths( $located ) ) {
			return false;
		}

		if ( $load ) {
			load_template( $located, $require_once );
		}

		return $located;
	}

	/**
	 * Whether a template name is safe to look up.
	 *
	 * Allows subdirectories (e.g. "players/default.php"), but rejects
	 * directory traversal, absolute paths, and non-PHP files.
	 *
	 * @since 2.4.6
	 *
	 * @param mixed $template_name Template name.
	 * @return bool
	 */
	protected function is_valid_template_name( $template_name ) {
		if ( ! is_string( $template_name ) || '' === $template_name ) {
			return false;
		}

		$template_name = str_replace( '\\', '/', $template_name );

		if (
			'/' === $template_name[0] ||
			false !== strpos( $template_name, "\0" ) ||
			0 !== validate_file( $template_name )
		) {
			return false;
		}

		return 'php' === strtolower( pathinfo( $template_name, PATHINFO_EXTENSION ) );
	}

	/**
	 * Whether a resolved file path is inside one of the template directories.
	 *
	 * @since 2.4.6
	 *
	 * @param string $file File path.
	 * @return bool
	 */
	protected function is_in_template_paths( $file ) {
		$file = realpath( $file );

		if ( false === $file ) {
			return false;
		}

		foreach ( $this->get_template_paths() as $template_path ) {
			$template_path = realpath( $template_path );

			if ( false === $template_path ) {
				continue;
			}

			if ( 0 === strpos( $file, trailingslashit( $template_path ) ) ) {
				return true;
			}
		}

		return false;
	}
}
