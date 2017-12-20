<?php
/**
 * Cue playlist widget.
 *
 * @package   Cue
 * @copyright Copyright (c) 2014, AudioTheme, LLC
 * @license   GPL-2.0+
 * @since     1.0.0
 */

/**
 * Playlist widget class.
 *
 * @package Cue
 * @since   1.0.0
 */
class Cue_Widget_Playlist extends WP_Widget {
	/**
	 * Setup widget options.
	 *
	 * Allows child classes to overload the defaults.
	 *
	 * @since 1.0.0
	 * @see WP_Widget::construct()
	 */
	public function __construct( $id_base = false, $name = false, $widget_options = array(), $control_options = array() ) {
		$id_base = $id_base ? $id_base : 'cue-playlist';
		$name = $name ? $name : esc_html__( 'Playlist', 'cue' );

		$widget_options = wp_parse_args( $widget_options, array(
			'classname'   => 'widget_cue_playlist',
			'description' => esc_html__( 'A playable collection of audio tracks.', 'cue' ),
		) );

		$control_options = wp_parse_args( $control_options, array() );

		parent::__construct( $id_base, $name, $widget_options, $control_options );
	}

	/**
	 * Default widget front end display method.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args     Args specific to the widget area (sidebar).
	 * @param array $instance Widget instance settings.
	 */
	public function widget( $args, $instance ) {
		extract( $args );

		if ( empty( $instance['post_id'] ) ) {
			return;
		}

		$instance['title_raw'] = $instance['title'];
		$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );
		$instance['title'] = apply_filters( 'cue_widget_title', $instance['title'], $instance, $args, $this->id_base );

		// Allow templates specific to widget areas.
		$templates = array( "widget-{$args['id']}-playlist.php", 'widget-playlist.php' );

		echo $before_widget;

		echo ( empty( $instance['title'] ) ) ? '' : $before_title . $instance['title'] . $after_title;

		if ( ! $output = apply_filters( 'cue_playlist_widget_output', '', $instance, $args ) ) {
			cue_playlist( $instance['post_id'], array( 'template' => $templates ) );
		}

		echo $after_widget;
	}

	/**
	 * Form to modify widget instance settings.
	 *
	 * @since 1.0.0
	 *
	 * @param array $instance Current widget instance settings.
	 */
	public function form( $instance ) {
		$instance = wp_parse_args( (array) $instance, array(
			'post_id' => '',
			'title'   => '',
		) );

		$playlists = get_posts( array(
			'post_type'      => 'cue_playlist',
			'orderby'        => 'title',
			'order'          => 'asc',
			'posts_per_page' => -1,
		) );

		$title = wp_strip_all_tags( $instance['title'] );
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php esc_html_e( 'Title:', 'cue' ); ?></label>
			<input type="text" name="<?php echo $this->get_field_name( 'title' ); ?>" id="<?php echo $this->get_field_id( 'title' ); ?>" value="<?php echo esc_attr( $title ); ?>" class="widefat">
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'post_id' ); ?>"><?php esc_html_e( 'Playlist:', 'cue' ); ?></label>
			<select name="<?php echo $this->get_field_name( 'post_id' ); ?>" id="<?php echo $this->get_field_id( 'post_id' ); ?>" class="widefat">
				<option value=""></option>
				<?php
				foreach ( $playlists as $playlist ) {
					printf(
						'<option value="%s"%s>%s</option>',
						$playlist->ID,
						selected( $instance['post_id'], $playlist->ID, false ),
						esc_html( $playlist->post_title )
					);
				}
				?>
			</select>
		</p>
		<?php
	}

	/**
	 * Save widget settings.
	 *
	 * @since 1.0.0
	 *
	 * @param array $new_instance New widget settings.
	 * @param array $old_instance Old widget settings.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = wp_parse_args( $new_instance, $old_instance );

		$instance['title'] = wp_strip_all_tags( $new_instance['title'] );

		return $instance;
	}
}
