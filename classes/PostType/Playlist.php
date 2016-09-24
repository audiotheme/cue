<?php
/**
 * Playlist post type registration and integration.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @link      https://audiotheme.com/
 * @since     2.0.0
 */

/**
 * Class for registering the playlist post type and integration.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_PostType_Playlist extends Cue_PostType_AbstractPostType {
	/**
	 * Post type name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	protected $post_type = 'cue_playlist';

	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	public function register_hooks() {
		add_action( 'init',                  array( $this, 'register_post_type' ), 15 );
		add_filter( 'post_updated_messages', array( $this, 'post_updated_messages' ) );
	}

	/**
	 * Retrieve post type registration argments.
	 *
	 * @since 2.0.0
	 *
	 * @return array
	 */
	protected function get_args() {
		return apply_filters( 'cue_playlist_args', array(
			'can_export'         => true,
			'has_archive'        => false,
			'hierarchical'       => false,
			'labels'             => $this->get_labels(),
			'menu_icon'          => 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCgk8cGF0aCBkPSJNMTEsOGg3djJoLTdWOHogTTcsM3Y3LjNDNi41LDEwLjEsNiwxMCw1LjUsMTBDMy42LDEwLDIsMTEuNiwyLDEzLjVTMy42LDE3LDUuNSwxN1M5LDE1LjQsOSwxMy41VjZoOVYzSDd6IE0xMSwxM2g3di0yaC03IFYxM3ogTTExLDE2aDd2LTJoLTdWMTZ6Ii8+DQo8L3N2Zz4NCg==',
			'public'             => true,
			'publicly_queryable' => false,
			'rewrite'            => false,
			'show_ui'            => true,
			'show_in_admin_bar'  => false,
			'show_in_menu'       => true,
			'show_in_nav_menus'  => false,
			'supports'           => array( 'title', 'thumbnail' ),
		) );
	}

	/**
	 * Retrieve post type labels.
	 *
	 * @return array
	 */
	protected function get_labels() {
		return array(
			'name'                  => esc_html_x( 'Playlists', 'post type general name', 'cue' ),
			'singular_name'         => esc_html_x( 'Playlist', 'post type singular name', 'cue' ),
			'add_new'               => esc_html_x( 'Add New', 'playlist', 'cue' ),
			'add_new_item'          => esc_html__( 'Add New Playlist', 'cue' ),
			'edit_item'             => esc_html__( 'Edit Playlist', 'cue' ),
			'new_item'              => esc_html__( 'New Playlist', 'cue' ),
			'view_item'             => esc_html__( 'View Playlist', 'cue' ),
			'search_items'          => esc_html__( 'Search Playlists', 'cue' ),
			'not_found'             => esc_html__( 'No playlists found', 'cue' ),
			'not_found_in_trash'    => esc_html__( 'No playlists found in Trash', 'cue' ),
			'parent_item_colon'     => esc_html__( 'Parent Playlist:', 'cue' ),
			'all_items'             => esc_html__( 'All Playlists', 'cue' ),
			'menu_name'             => esc_html_x( 'Playlists', 'admin menu name', 'cue' ),
			'name_admin_bar'        => esc_html_x( 'Playlist', 'add new on admin bar', 'cue' ),
			'archives'              => esc_html__( 'Post Archives', 'cue' ),
			'insert_into_item'      => esc_html__( 'Insert into playlist', 'cue' ),
			'uploaded_to_this_item' => esc_html__( 'Uploaded to this playlist', 'cue' ),
			'featured_image'        => esc_html__( 'Featured Image', 'cue' ),
			'set_featured_image'    => esc_html__( 'Set featured image', 'cue' ),
			'remove_featured_image' => esc_html__( 'Remove featured image', 'cue' ),
			'use_featured_image'    => esc_html__( 'Use as featured image', 'cue' ),
			'filter_items_list'     => esc_html__( 'Filter playlists list', 'cue' ),
			'items_list_navigation' => esc_html__( 'Playlists list navigation', 'cue' ),
			'items_list'            => esc_html__( 'Playlists list', 'cue' ),
		);
	}

	/**
	 * Retrieve post updated messages.
	 *
	 * @since 2.0.0
	 *
	 * @param WP_Post $post Post object.
	 * @return array
	 */
	protected function get_updated_messages( $post ) {
		return array(
			0  => '', // Unused. Messages start at index 1.
			1  => esc_html__( 'Playlist updated.', 'cue' ),
			2  => esc_html__( 'Custom field updated.', 'cue' ),
			3  => esc_html__( 'Custom field deleted.', 'cue' ),
			4  => esc_html__( 'Playlist updated.', 'cue' ),
			/* translators: %s: date and time of the revision */
			5  => isset( $_GET['revision'] ) ? sprintf( esc_html__( 'Playlist restored to revision from %s.', 'cue' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
			6  => esc_html__( 'Playlist published.', 'cue' ),
			7  => esc_html__( 'Playlist saved.', 'cue' ),
			8  => esc_html__( 'Playlist submitted.', 'cue' ),
			9  => sprintf(
				esc_html__( 'Playlist scheduled for: %s.', 'cue' ),
				/* translators: Publish box date format, see http://php.net/date */
				'<strong>' . date_i18n( esc_html__( 'M j, Y @ H:i', 'cue' ), strtotime( $post->post_date ) ) . '</strong>'
			),
			10 => esc_html__( 'Playlist draft updated.', 'cue' ),
			'preview' => esc_html__( 'Preview playlist', 'cue' ),
			'view'    => esc_html__( 'View playlist', 'cue' ),
		);
	}
}
