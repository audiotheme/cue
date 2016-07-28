<?php
/**
 * Base hook provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Base hook provider class.
 *
 * @package Cue
 * @since   2.0.0
 */
abstract class Cue_AbstractProvider {
	/**
	 * Plugin instance.
	 *
	 * @since 2.0.0
	 * @var Cue_Plugin
	 */
	protected $plugin;

	/**
	 * Set a reference to the main plugin instance.
	 *
	 * @since 2.0.0
	 *
	 * @param Cue_Plugin $plugin Main plugin instance.
	 */
	public function set_plugin( $plugin ) {
		$this->plugin = $plugin;
		return $this;
	}

	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	abstract public function register_hooks();
}
