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
}
