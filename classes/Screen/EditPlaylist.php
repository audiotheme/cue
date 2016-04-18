<?php
/**
 * Edit playlist screen.
 *
 * @package   Cue
 * @copyright Copyright (c) 2016, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     2.0.0
 */

/**
 * Edit playlist screen class.
 *
 * @package Cue
 * @since   2.0.0
 */
class Cue_Screen_EditPlaylist extends Cue_AbstractProvider {
	/**
	 * Register hooks.
	 *
	 * @since 2.0.0
	 */
	public function register_hooks() {
		add_action( 'load-post.php',               array( $this, 'load_screen' ) );
		add_action( 'load-post-new.php',           array( $this, 'load_screen' ) );
		add_action( 'add_meta_boxes_cue_playlist', array( $this, 'register_meta_boxes' ) );
		add_action( 'save_post_cue_playlist',      array( $this, 'on_playlist_save' ) );
	}

	/**
	 * Set up the screen.
	 *
	 * @since 2.0.0
	 */
	public function load_screen() {
		if ( 'cue_playlist' !== get_current_screen()->id ) {
			return;
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'edit_form_after_title', array( $this, 'display_edit_view' ) );
		add_action( 'admin_footer',          array( $this, 'print_templates' ) );
	}

	/**
	 * Register record meta boxes.
	 *
	 * @since 2.0.0
	 *
	 * @param WP_Post $post The record post object being edited.
	 */
	public function register_meta_boxes( $post ) {
		$players = get_cue_players();

		if ( ! empty( $players ) ) {
			add_meta_box(
				'cue-players',
				__( 'Players', 'cue' ),
				array( $this, 'display_players_meta_box' ),
				'cue_playlist',
				'side',
				'default'
			);
		}

		add_meta_box(
			'cue-playlist-shortcode',
			__( 'Shortcode', 'cue' ),
			array( $this, 'display_shortcode_meta_box' ),
			'cue_playlist',
			'side',
			'default'
		);
	}

	/**
	 * Enqueue assets for the Edit Record screen.
	 *
	 * @since 2.0.0
	 */
	public function enqueue_assets() {
		$post = get_post();

		wp_enqueue_media();
		wp_enqueue_style( 'genericons', $this->plugin->get_url( 'assets/css/genericons.css' ) );
		wp_enqueue_style( 'cue-admin', $this->plugin->get_url( 'admin/assets/css/admin.min.css', array( 'genericons', 'mediaelement' ) ) );

		wp_enqueue_script(
			'cue-admin',
			$this->plugin->get_url( 'admin/assets/js/cue.min.js' ),
			array(
				'backbone',
				'jquery-ui-sortable',
				'media-upload',
				'media-views',
				'mediaelement',
				'wp-util',
			),
			'1.0.0',
			true
		);

		wp_localize_script( 'cue-admin', '_cueSettings', array(
			'tracks'   => get_cue_playlist_tracks( $post->ID, 'edit' ),
			'settings' => array(
				'pluginPath' => includes_url( 'js/mediaelement/', 'relative' ),
				'postId'     => $post->ID,
				'saveNonce'  => wp_create_nonce( 'save-tracks_' . $post->ID ),
			),
			'l10n' => array(
				'addTracks'  => __( 'Add Tracks', 'cue' ),
				'addFromUrl' => __( 'Add from URL', 'cue' ),
				'workflows'  => array(
					'selectArtwork' => array(
						'fileTypes'       => __( 'Image Files', 'cue' ),
						'frameTitle'      => __( 'Choose an Image', 'cue' ),
						'frameButtonText' => __( 'Update Image', 'cue' ),
					),
					'selectAudio'   => array(
						'fileTypes'       => __( 'Audio Files', 'cue' ),
						'frameTitle'      => __( 'Choose an Audio File', 'cue' ),
						'frameButtonText' => __( 'Update Audio', 'cue' ),
					),
					'addTracks'     => array(
						'fileTypes'       => __( 'Audio Files', 'cue' ),
						'frameTitle'      => __( 'Choose Tracks', 'cue' ),
						'frameButtonText' => __( 'Add Tracks', 'cue' ),
					),
				),
			),
		) );
	}

	/**
	 * Display the basic starting view.
	 *
	 * @since 2.0.0
	 *
	 * @param WP_Post $post Playlist post object.
	 */
	public function display_edit_view( $post ) {
		?>
		<div id="cue-section" class="cue-section">
			<h3 class="cue-section-title"><?php _e( 'Tracks', 'cue' ); ?></h3>
			<p>
				<?php _e( 'Add tracks to the playlist, then drag and drop to reorder them. Click the arrow on the right of each item to reveal more configuration options.', 'cue' ); ?>
			</p>
		</div>
		<?php
	}

	/**
	 * Display a meta box to choose which theme-registered players to connect a
	 * playlist with.
	 *
	 * @since 2.0.0
	 *
	 * @param WP_Post $post Post object.
	 */
	public function display_players_meta_box( $post ) {
		wp_nonce_field( 'save-playlist-players_' . $post->ID, 'cue_playlist_players_nonce' );

		printf( '<p>%s</p>', __( 'Choose which players should use this playlist:', 'cue' ) );

		$players = get_cue_players();
		echo '<ul style="margin-bottom: 0">';
			foreach ( $players as $id => $player ) {
				printf( '<li><label><input type="checkbox" name="cue_players[]" value="%2$s"%3$s> %1$s</label></li>',
					esc_html( $player['name'] ),
					esc_attr( $player['id'] ),
					checked( $player['playlist_id'], $post->ID, false )
				);
			}
		echo '</ul>';
	}

	/**
	 * Display a meta box with instructions to embed the playlist.
	 *
	 * @since 2.0.0
	 *
	 * @param WP_Post $post Post object.
	 */
	public function display_shortcode_meta_box( $post ) {
		?>
		<p>
			<?php _e( 'Copy and paste the following shortcode into a post or page to embed this playlist.', 'cue' ); ?>
		</p>
		<p>
			<input type="text" value="<?php echo esc_attr( '[cue id="' . $post->ID . '"]' ); ?>" readonly>
		</p>
		<?php
	}

	/**
	 * Include the HTML templates.
	 *
	 * @since 1.0.0
	 */
	public function print_templates() {
		include( $this->plugin->get_path( 'admin/views/templates-playlist.php' ) );
	}

	/**
	 * Save players connected to a playlist.
	 *
	 * @since 2.0.0
	 *
	 * @param int $post_id Post ID.
	 */
	public function on_playlist_save( $post_id ) {
		static $is_active = false; // Prevent recursion.

		$is_autosave    = defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE;
		$is_revision    = wp_is_post_revision( $post_id );
		$is_valid_nonce = isset( $_POST['cue_playlist_players_nonce'] ) && wp_verify_nonce( $_POST['cue_playlist_players_nonce'], 'save-playlist-players_' . $post_id );

		// Bail if the data shouldn't be saved or intention can't be verified.
		if ( $is_active || $is_autosave || $is_revision || ! $is_valid_nonce ) {
			return;
		}

		$is_active = true;

		$data = get_theme_mod( 'cue_players', array() );

		// Reset players connected to the current playlist.
		foreach ( $data as $player_id => $playlist_id ) {
			if ( $playlist_id == $post_id ) {
				$data[ $player_id ] = 0;
			}
		}

		// Connect selected players with the current playlist.
		if ( ! empty( $_POST['cue_players'] ) ) {
			foreach ( $_POST['cue_players'] as $player_id ) {
				$data[ $player_id ] = $post_id;
			}
		}

		set_theme_mod( 'cue_players', $data );

		$is_active = false;
	}
}
