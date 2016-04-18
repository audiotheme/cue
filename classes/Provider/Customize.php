<?php
/**
 * Customizer provider.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Customizer provider class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Provider_Customize extends Cue_AbstractProvider {
	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	public function register_hooks() {
		add_action( 'customize_register', array( $this, 'customize_register' ) );
	}

	/**
	 * Add a Customizer section for selecting playlists for registered players.
	 *
	 * @since 2.0.0
	 *
	 * @param WP_Customize_Manager $wp_customize Customizer instance.
	 */
	public function customize_register( $wp_customize ) {
		$description = '';
		$players     = get_cue_players();

		if ( empty( $players ) ) {
			return;
		}

		$playlists = get_posts( array(
			'post_type'      => 'cue_playlist',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'asc',
		) );

		$wp_customize->add_section( 'cue', array(
			'title'       => __( 'Cue Players', 'cue' ),
			'description' => __( 'Choose a playlist for each registered player.', 'cue' ),
			'priority'    => 115,
		) );

		if ( empty( $playlists ) ) {
			$playlists = array();

			$description = sprintf(
				__( '<a href="%s">Create a playlist</a> for this player.', 'cue' ),
				admin_url( 'post-new.php?post_type=cue_playlist' )
			);
		} else {
			// Create an array: ID => post_title
			$playlists = array_combine( wp_list_pluck( $playlists, 'ID' ), wp_list_pluck( $playlists, 'post_title' ) );
		}

		$playlists = array( 0 => '' ) + $playlists;

		foreach ( $players as $id => $player ) {
			$id = sanitize_key( $id );

			$wp_customize->add_setting( 'cue_players[' . $id . ']', array(
				'capability'        => 'edit_theme_options',
				'sanitize_callback' => 'absint',
			) );

			$wp_customize->add_control( 'cue_player_' . $id, array(
				'choices'     => $playlists,
				'description' => $description,
				'label'       => $player['name'],
				'section'     => 'cue',
				'settings'    => 'cue_players[' . $id . ']',
				'type'        => 'select',
			) );
		}
	}
}
