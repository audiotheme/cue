<?php
/**
 * Media provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.1.0
 */

/**
 * Media provider class.
 *
 * @package Cue
 * @since   2.1.0
 */
class Cue_Provider_Media extends Cue_AbstractProvider {
	/**
	 * Register hooks.
	 *
	 * @since 2.1.0
	 */
	public function register_hooks() {
		add_filter( 'wp_audio_shortcode', array( $this, 'filter_audio_shortcode_html' ), 10, 3 );
	}

	/**
	 * Filter native audio shortcode HTML.
	 *
	 * Appends audio metadata in a JSON script tag and enqueues a MediaElement.js
	 * plugin to read the JSON data.
	 *
	 * @since 2.1.0
	 *
	 * @param  string  $html  HTML output.
	 * @param  array   $atts  Array of shortcode attributes.
	 * @param  WP_Post $audio Audio post object.
	 * @return string
	 */
	public function filter_audio_shortcode_html( $html, $atts, $audio ) {
		if ( 'default' === get_cue_native_theme() ) {
			return $html;
		}

		$meta = wp_get_attachment_metadata( $audio->ID );

		$html .= sprintf(
			'<script type="application/json" class="cue-wp-mediaelement-metadata">%s</script>',
			wp_json_encode( array(
				'artist' => $meta['artist'],
				'theme'  => get_cue_native_theme(),
				'title'  => get_the_title( $audio ),
			) )
		);

		wp_enqueue_script( 'cue-wp-mediaelement' );

		return $html;
	}
}
