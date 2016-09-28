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
		add_filter( 'shortcode_atts_audio', array( $this, 'filter_audio_shortcode_attributes' ), 8, 3 );
		add_filter( 'wp_audio_shortcode',   array( $this, 'filter_audio_shortcode_html' ), 10, 3 );
	}

	/**
	 * Filter the audio shortcode attributes.
	 *
	 * @since 2.1.0
	 *
	 * @param array $atts      Shortcode attributes.
	 * @param array $defaults  The supported attributes and their defaults.
	 * @param array $user_atts The user defined shortcode attributes.
	 * @return array
	 */
	public function filter_audio_shortcode_attributes( $atts, $defaults, $user_atts ) {
		$atts['artist'] = '';
		if ( isset( $user_atts['artist'] ) ) {
			$atts['artist'] = $user_atts['artist'];
		}

		$atts['title'] = '';
		if ( isset( $user_atts['title'] ) ) {
			$atts['title'] = $user_atts['title'];
		}

		$atts['theme'] = '';
		if ( isset( $user_atts['theme'] ) ) {
			$atts['theme'] = sanitize_key( $user_atts['theme'] );
		}

		return $atts;
	}

	/**
	 * Filter native audio shortcode HTML.
	 *
	 * Appends audio metadata in a JSON script tag and enqueues a MediaElement.js
	 * plugin to read the JSON data.
	 *
	 * @since 2.1.0
	 *
	 * @param string  $html  HTML output.
	 * @param array   $atts  Array of shortcode attributes.
	 * @param WP_Post $audio Audio attachment.
	 * @return string
	 */
	public function filter_audio_shortcode_html( $html, $atts, $audio ) {
		$theme = get_cue_native_theme( $atts );

		if ( is_admin() || 'default' === $theme ) {
			return $html;
		}

		if ( ! empty( $audio ) ) {
			$meta = wp_get_attachment_metadata( $audio->ID );
		}

		if ( empty( $atts['artist'] ) && ! empty( $meta['artist'] ) ) {
			$atts['artist'] = $meta['artist'];
		}

		if ( empty( $atts['title'] ) && ! empty( $meta['title'] ) ) {
			$atts['title'] = $meta['title'];
		}

		$html .= sprintf(
			'<script type="application/json" class="cue-wp-mediaelement-metadata">%s</script>',
			wp_json_encode( array(
				'artist' => esc_html( $atts['artist'] ),
				'theme'  => esc_html( $theme ),
				'title'  => esc_html( $atts['title'] ),
			) )
		);

		wp_enqueue_script( 'cue-wp-mediaelement' );

		return $html;
	}
}
