<?php
/**
 * Underscore.js templates for the Media Manager.
 *
 * @package   Cue
 * @since     2.2.0
 * @copyright Copyright (c) 2016 AudioTheme, LLC
 * @license   GPL-2.0+
 */

?>

<script type="text/html" id="tmpl-cue-playlist-browser-list-item">
	<div class="cue-media-thumbnail">
		<?php include( $this->plugin->get_path( 'admin/assets/images/playlist.svg' ) ); ?>
		<div class="cue-media-thumbnail-image">
			<# if ( data.thumbnail ) { #>
				<img src="{{ data.thumbnail }}">
			<# } #>
		</div>
		<span class="cue-media-thumbnail-title">{{ data.title }}</span>
	</div>
	<button type="button" class="cue-media-toggle-button dashicons dashicons-yes" tabindex="0">
		<span class="screen-reader-text"><?php esc_html_e( 'Deselect', 'cue' ); ?></span>
	</button>
</script>

<script type="text/html" id="tmpl-cue-playlist-browser-sidebar">
	<div class="cue-playlist-browser-settings collection-settings">
		<h2><?php esc_html_e( 'Playlist Settings', 'cue' ); ?></h2>

		<?php $themes = get_cue_themes(); ?>
		<div class="setting">
			<p>
				<label>
					<span><?php esc_html_e( 'Theme', 'cue' ); ?></span>
					<select data-setting="theme">
						<option value=""></option>
						<?php
						foreach ( $themes as $id => $name ) {
							printf(
								'<option value="%s">%s</option>',
								esc_attr( $id ),
								esc_html( $name )
							);
						}
						?>
					</select>
				</label>
			</p>

			<?php if ( ! function_exists( 'cuepro' ) ) : ?>
				<p class="description">
					<?php
					wp_kses( printf(
						__( '<a href="%s" target="_blank">Upgrade to Cue Pro</a> to access more themes.', 'cue' ),
						'https://audiotheme.com/view/cuepro/?utm_source=wordpress-plugin&utm_medium=link&utm_content=cue-theme-description&utm_campaign=plugins'
					), array( 'a' => array( 'href' => true, 'target' => true ) ) );
					?>
				</p>
			<?php endif; ?>
		</div>

		<!--<div class="setting">
			<p>
				<label>
					<span><?php esc_html_e( 'Width', 'cue' ); ?></span>
					<input type="text" data-setting="width">
				</label>
			</p>
		</div>-->

		<div class="setting">
			<p>
				<label>
					<input type="checkbox" data-setting="show_playlist" checked>
					<span><?php esc_html_e( 'Show Tracklist', 'cue' ); ?></span>
				</label>
			</p>
		</div>
	</div>
</script>

<script type="text/html" id="tmpl-cue-playlist-browser-empty">
	<h2><?php esc_html_e( 'No items found.', 'cue' ); ?></h2>
	<p>
		<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=cue_playlist' ) ); ?>"><?php esc_html_e( 'Create a playlist.', 'cue' ); ?></a>
	</p>
</script>
