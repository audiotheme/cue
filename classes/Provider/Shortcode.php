<?php
/**
 * Cue shortcode provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Cue shortcode provider class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Provider_Shortcode extends Cue_AbstractProvider {
	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	public function register_hooks() {
		add_shortcode( 'cue', array( $this, 'render_shortcode' ) );
	}

	/**
	 * Playlist shortcode handler.
	 *
	 * @since 2.0.0
	 *
	 * @param array $atts Optional. List of shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_shortcode( $atts = array() ) {
		$atts = shortcode_atts(
			array(
				'id'            => 0,
				'show_playlist' => true,
				'theme'         => get_cue_default_theme(),
				'template'      => '',
			),
			$atts,
			'cue'
		);

		$id = $atts['id'];
		unset( $atts['id'] );

		$atts['show_playlist'] = $this->shortcode_bool( $atts['show_playlist'] );

		ob_start();
		cue_playlist( $id, $atts );
		return ob_get_clean();
	}

	/**
	 * Helper method to determine if a shortcode attribute is true or false.
	 *
	 * @since 1.2.4
	 *
	 * @param string|int|bool $var Attribute value.
	 * @return bool
	 */
	protected function shortcode_bool( $var ) {
		$falsey = array( 'false', '0', 'no', 'n' );
		return ( ! $var || in_array( strtolower( $var ), $falsey, true ) ) ? false : true;
	}
}
